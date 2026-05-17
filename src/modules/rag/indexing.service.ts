import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type EmbeddingTable =
  | "documentEmbeddingAdmin"
  | "documentEmbeddingProvider"
  | "documentEmbeddingCustomer";

type Role = "admin" | "provider" | "customer";

interface IndexDocumentParams {
  chunkey: string;
  sourceType: string;
  sourceId: string;
  sourceLabel: string;
  content: string;
  metadata: Record<string, unknown>;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const toVectorLiteral = (embedding: number[]): string =>
  `[${embedding.join(",")}]`;

const ROLE_TABLE_MAP: Record<Role, EmbeddingTable> = {
  admin: "documentEmbeddingAdmin",
  provider: "documentEmbeddingProvider",
  customer: "documentEmbeddingCustomer",
};

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  // ── Core upsert ──────────────────────────────

  private async upsertEmbedding(
    table: EmbeddingTable,
    params: IndexDocumentParams & { embedding: number[] }
  ): Promise<void> {
    const vectorLiteral = toVectorLiteral(params.embedding);

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO ${Prisma.raw(`"${table}"`)}
        ("id", "chunkey", "sourceType", "sourceId", "sourceLabel",
         "content", "metadata", "embedding", "updatedAt")
      VALUES (
        ${Prisma.raw("gen_random_uuid()")},
        ${params.chunkey},
        ${params.sourceType},
        ${params.sourceId},
        ${params.sourceLabel ?? null},
        ${params.content},
        ${JSON.stringify(params.metadata ?? {})}::jsonb,
        CAST(${vectorLiteral} AS vector),
        NOW()
      )
      ON CONFLICT ("chunkey") DO UPDATE SET
        "sourceType"  = EXCLUDED."sourceType",
        "sourceId"    = EXCLUDED."sourceId",
        "sourceLabel" = EXCLUDED."sourceLabel",
        "content"     = EXCLUDED."content",
        "metadata"    = EXCLUDED."metadata",
        "embedding"   = EXCLUDED."embedding",
        "isDeleted"   = false,
        "deletedAt"   = null,
        "updatedAt"   = NOW()
    `);
  }

  // ── Public: index a single document ──────────

  async indexDocument(
    role: Role,
    params: IndexDocumentParams
  ): Promise<void> {
    const embedding = await this.embeddingService.generateEmbedding(
      params.content
    );

    await this.upsertEmbedding(ROLE_TABLE_MAP[role], {
      ...params,
      embedding,
    });
  }

  // ── Admin: index everything ───────────────────

  async indexAllForAdmin(): Promise<{ indexed: number; breakdown: Record<string, number> }> {
    const breakdown: Record<string, number> = {
      meals: 0,
      orders: 0,
      providers: 0,
      customers: 0,
    };

    await Promise.all([
      this.indexMeals(breakdown),
      this.indexOrders(breakdown),
      this.indexProviders(breakdown),
      this.indexCustomers(breakdown),
    ]);

    const indexed = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { indexed, breakdown };
  }

  // ── Soft delete a single document ────────────

  async deleteDocument(chunkey: string, table: EmbeddingTable): Promise<void> {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE ${Prisma.raw(`"${table}"`)}
      SET "isDeleted" = true, "deletedAt" = NOW()
      WHERE "chunkey" = ${chunkey}
    `);
  }

  // ═══════════════════════════════════════════
  // Single-entity index methods
  // (call these when one record is created/updated)
  // ═══════════════════════════════════════════

  // ── Single: Meal ──────────────────────────────

  async indexOneMeal(mealId: string): Promise<void> {
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        category: true,
        provider: { include: { ProviderProfiles: true } },
        reviews: true,
      },
    });

    if (!meal) throw new Error(`Meal not found: ${mealId}`);

    const reviewSummary =
      meal.reviews.length > 0
        ? meal.reviews.map((r) => r.comment ?? "").filter(Boolean).join(" | ")
        : "No reviews yet";

    const content = [
      `Meal Name: ${meal.name}`,
      `Description: ${meal.description ?? "N/A"}`,
      `Price: ${meal.price}`,
      `Dietary Preferences: ${meal.dietaryPreferences}`,
      `Rating: ${meal.rating}`,
      `Category: ${meal.category?.name ?? "Uncategorized"}`,
      `Available: ${meal.isAvailable}`,
      `Provider: ${meal.provider?.ProviderProfiles?.restaurantName ?? meal.provider?.name ?? "Unknown"}`,
      `Customer Reviews: ${reviewSummary}`,
    ].join("\n");

    await this.indexDocument("admin", {
      chunkey: `meal-${meal.id}`,
      sourceType: "meal",
      sourceId: meal.id,
      sourceLabel: "admin_meals",
      content,
      metadata: {
        mealId: meal.id,
        name: meal.name,
        category: meal.category?.name,
        rating: meal.rating,
        price: meal.price,
        isAvailable: meal.isAvailable,
        providerId: meal.providerId,
      },
    });
  }

  // ── Single: Order ─────────────────────────────

  async indexOneOrder(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { meal: true } },
      },
    });

    if (!order) throw new Error(`Order not found: ${orderId}`);

    const itemSummary =
      order.items.length > 0
        ? order.items
            .map((item) => `${item.meal?.name ?? "Unknown"} x${item.quantity}`)
            .join(", ")
        : "No items";

    const content = [
      `Order ID: ${order.id}`,
      `Customer ID: ${order.customerId ?? "Guest"}`,
      `Status: ${order.status}`,
      `Total Amount: ${order.totalAmount ?? 0}`,
      `Delivery Address: ${order.deliveryAddress ?? "N/A"}`,
      `Payment Method: ${order.paymentMethod ?? "N/A"}`,
      `Items: ${itemSummary}`,
      `Placed At: ${order.createdAt.toISOString()}`,
    ].join("\n");

    await this.indexDocument("admin", {
      chunkey: `order-${order.id}`,
      sourceType: "order",
      sourceId: order.id,
      sourceLabel: "admin_orders",
      content,
      metadata: {
        orderId: order.id,
        customerId: order.customerId,
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: order.items.length,
        paymentMethod: order.paymentMethod,
      },
    });
  }

  // ── Single: Provider ──────────────────────────

  async indexOneProvider(providerId: string): Promise<void> {
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
      include: {
        ProviderProfiles: true,
        Meal: { include: { category: true } },
        reviews: true,
      },
    });

    if (!provider) throw new Error(`Provider not found: ${providerId}`);

    const profile = provider.ProviderProfiles;
    const mealList =
      provider.Meal.map((m) => `${m.name} (${m.category?.name ?? "?"})`)
        .join(", ") || "No meals listed";

    const content = [
      `Restaurant: ${profile?.restaurantName ?? provider.name}`,
      `Description: ${profile?.description ?? "N/A"}`,
      `Phone: ${profile?.phone ?? "N/A"}`,
      `Address: ${profile?.address ?? "N/A"}`,
      `Opening Hours: ${profile?.openingTime ?? "?"} – ${profile?.closingTime ?? "?"}`,
      `Currently Open: ${profile?.isOpen ?? false}`,
      `Total Meals: ${provider.Meal.length}`,
      `Meals: ${mealList}`,
      `Total Reviews: ${provider.reviews.length}`,
    ].join("\n");

    await this.indexDocument("admin", {
      chunkey: `provider-${provider.id}`,
      sourceType: "provider",
      sourceId: provider.id,
      sourceLabel: "admin_providers",
      content,
      metadata: {
        providerId: provider.id,
        restaurantName: profile?.restaurantName,
        address: profile?.address,
        phone: profile?.phone,
        isOpen: profile?.isOpen,
        mealCount: provider.Meal.length,
        reviewCount: provider.reviews.length,
      },
    });
  }

  // ── Single: Customer ──────────────────────────

  async indexOneCustomer(customerId: string): Promise<void> {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) throw new Error(`Customer not found: ${customerId}`);

    const content = [
      `Customer Name: ${customer.name}`,
      `Email: ${customer.email}`,
      `Status: ${customer.status}`,
      `Joined: ${customer.createdAt.toISOString()}`,
    ].join("\n");

    await this.indexDocument("admin", {
      chunkey: `customer-${customer.id}`,
      sourceType: "customer",
      sourceId: customer.id,
      sourceLabel: "admin_customers",
      content,
      metadata: {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
        status: customer.status,
      },
    });
  }

// ── Single: Admin ──────────────────────────

  async indexOneAdmin(adminId: string): Promise<void> {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin) throw new Error(`Admin not found: ${adminId}`);

  const content = [
    `Admin Name: ${admin.name}`,
    `Email: ${admin.email}`,
    `Role: ${admin.role}`,
    `Status: ${admin.status}`,
    `Email Verified: ${admin.emailVerified}`,
    `Joined: ${admin.createdAt.toISOString()}`,
  ].join("\n");

  await this.indexDocument("admin", {
    chunkey: `admin-${admin.id}`,
    sourceType: "admin",
    sourceId: admin.id,
    sourceLabel: "admin_users",
    content,
    metadata: {
      adminId: admin.id,
      name: admin.name,
      email: admin.email,
      status: admin.status,
      emailVerified: admin.emailVerified,
    },
  });
}
  // ═══════════════════════════════════════════
  // Bulk index methods (private — used by indexAllForAdmin)
  // ═══════════════════════════════════════════

  // ── Section: Meals ────────────────────────────

  private async indexMeals(breakdown: Record<string, number>): Promise<void> {
    const meals = await prisma.meal.findMany({
      include: {
        category: true,
        provider: {
          include: { ProviderProfiles: true },
        },
        reviews: true,
      },
    });

    for (const meal of meals) {
      const reviewSummary =
        meal.reviews.length > 0
          ? meal.reviews.map((r) => r.comment ?? "").filter(Boolean).join(" | ")
          : "No reviews yet";

      const content = [
        `Meal Name: ${meal.name}`,
        `Description: ${meal.description ?? "N/A"}`,
        `Price: ${meal.price}`,
        `Dietary Preferences: ${meal.dietaryPreferences}`,
        `Rating: ${meal.rating}`,
        `Category: ${meal.category?.name ?? "Uncategorized"}`,
        `Available: ${meal.isAvailable}`,
        `Provider: ${meal.provider?.ProviderProfiles?.restaurantName ?? meal.provider?.name ?? "Unknown"}`,
        `Customer Reviews: ${reviewSummary}`,
      ].join("\n");

      await this.indexDocument("admin", {
        chunkey: `meal-${meal.id}`,
        sourceType: "meal",
        sourceId: meal.id,
        sourceLabel: "admin_meals",
        content,
        metadata: {
          mealId: meal.id,
          name: meal.name,
          category: meal.category?.name,
          rating: meal.rating,
          price: meal.price,
          isAvailable: meal.isAvailable,
          providerId: meal.providerId,
        },
      });

      breakdown.meals++;
    }
  }

  
  // ── Section: Orders ───────────────────────────

  private async indexOrders(breakdown: Record<string, number>): Promise<void> {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { meal: true },
        },
      },
    });

    for (const order of orders) {
      const itemSummary =
        order.items.length > 0
          ? order.items
              .map((item) => `${item.meal?.name ?? "Unknown"} x${item.quantity}`)
              .join(", ")
          : "No items";

      const content = [
        `Order ID: ${order.id}`,
        `Customer ID: ${order.customerId ?? "Guest"}`,
        `Status: ${order.status}`,
        `Total Amount: ${order.totalAmount ?? 0}`,
        `Delivery Address: ${order.deliveryAddress ?? "N/A"}`,
        `Payment Method: ${order.paymentMethod ?? "N/A"}`,
        `Items: ${itemSummary}`,
        `Placed At: ${order.createdAt.toISOString()}`,
      ].join("\n");

      await this.indexDocument("admin", {
        chunkey: `order-${order.id}`,
        sourceType: "order",
        sourceId: order.id,
        sourceLabel: "admin_orders",
        content,
        metadata: {
          orderId: order.id,
          customerId: order.customerId,
          status: order.status,
          totalAmount: order.totalAmount,
          itemCount: order.items.length,
          paymentMethod: order.paymentMethod,
        },
      });

      breakdown.orders++;
    }
  }

  // ── Section: Providers ────────────────────────

  private async indexProviders(breakdown: Record<string, number>): Promise<void> {
    const providers = await prisma.user.findMany({
      where: { role: "provider" },
      include: {
        ProviderProfiles: true,
        Meal: { include: { category: true } },
        reviews: true,
      },
    });

    for (const provider of providers) {
      const profile = provider.ProviderProfiles;
      const mealList =
        provider.Meal.map((m) => `${m.name} (${m.category?.name ?? "?"})`)
          .join(", ") || "No meals listed";

      const content = [
        `Restaurant: ${profile?.restaurantName ?? provider.name}`,
        `Description: ${profile?.description ?? "N/A"}`,
        `Phone: ${profile?.phone ?? "N/A"}`,
        `Address: ${profile?.address ?? "N/A"}`,
        `Opening Hours: ${profile?.openingTime ?? "?"} – ${profile?.closingTime ?? "?"}`,
        `Currently Open: ${profile?.isOpen ?? false}`,
        `Total Meals: ${provider.Meal.length}`,
        `Meals: ${mealList}`,
        `Total Reviews: ${provider.reviews.length}`,
      ].join("\n");

      await this.indexDocument("admin", {
        chunkey: `provider-${provider.id}`,
        sourceType: "provider",
        sourceId: provider.id,
        sourceLabel: "admin_providers",
        content,
        metadata: {
          providerId: provider.id,
          restaurantName: profile?.restaurantName,
          address: profile?.address,
          phone: profile?.phone,
          isOpen: profile?.isOpen,
          mealCount: provider.Meal.length,
          reviewCount: provider.reviews.length,
        },
      });

      breakdown.providers++;
    }
  }

  // ── Section: Customers ────────────────────────

  private async indexCustomers(breakdown: Record<string, number>): Promise<void> {
    const customers = await prisma.user.findMany({
      where: { role: "customer" },
    });

    for (const customer of customers) {
      const content = [
        `Customer Name: ${customer.name}`,
        `Email: ${customer.email}`,
        `Status: ${customer.status}`,
        `Joined: ${customer.createdAt.toISOString()}`,
      ].join("\n");

      await this.indexDocument("admin", {
        chunkey: `customer-${customer.id}`,
        sourceType: "customer",
        sourceId: customer.id,
        sourceLabel: "admin_customers",
        content,
        metadata: {
          customerId: customer.id,
          name: customer.name,
          email: customer.email,
          status: customer.status,
        },
      });

      breakdown.customers++;
    }
  }
}
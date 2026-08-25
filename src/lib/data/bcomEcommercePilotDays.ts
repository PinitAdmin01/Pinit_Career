import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_ECOMMERCE_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "E-Commerce Business Models: D2C Gross Margin Advantage",
    "overviewMetaphor": "Direct-to-Consumer (D2C) is Selling Fresh Produce from Your Own Organic Farm Stand Instead of Through Supermarket Distributors: When you manufacture a premium product for $25.00 with a $100.00 retail price, selling through traditional wholesale distributors forces you to sell at a 50% discount ($50.00 wholesale price), leaving only $25.00 in gross profit (50.0% gross margin); selling Direct-to-Consumer (D2C) on your own digital store captures the full $100.00 retail price, generating $75.00 in gross profit (75.0% gross margin) and owning 100% of the customer relationship data.",
    "blocks": [
      {
        "id": "ecom-d1-b1-d2c-vs-wholesale-margin-advantage",
        "day": 1,
        "blockNumber": 1,
        "title": "D2C vs Traditional Wholesale: The 75% vs 50% Gross Margin Advantage",
        "conceptBudget": {
          "primaryConcept": "D2C Gross Margin Economics",
          "supportingTerms": [
            "Manufacturing COGS ($25.00)",
            "Retail MSRP ($100.00)",
            "Wholesale Selling Price (50% of MSRP = $50.00 $\\implies$ Gross Margin = 50.0%)",
            "D2C Selling Price ($100.00 $\\implies$ Gross Margin = 75.0% [+$50/unit profit!])"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Channel Margin Ledger ($100 MSRP, $25 COGS)",
              "boxes": [
                {
                  "label": "Traditional Wholesale",
                  "value": "Sells at $50 -> Profit = $25.00 (50.0% Gross Margin)",
                  "varType": "Wholesale",
                  "isUpdated": false
                },
                {
                  "label": "Direct-to-Consumer (D2C)",
                  "value": "Sells at $100 -> Profit = $75.00 (75.0% Gross Margin)",
                  "varType": "D2C Channel",
                  "isUpdated": false
                },
                {
                  "label": "D2C Margin Premium",
                  "value": "+$50.00 Cash per unit (3x higher gross profit per order!)",
                  "varType": "Margin Advantage",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "channel_margin_demo.js",
            "initialCode": "function calculateChannelMargin(retailPrice, cogs, isD2c) {\n  const sellingPrice = isD2c ? retailPrice : retailPrice * 0.50;\n  const grossProfit = sellingPrice - cogs;\n  const marginPct = (grossProfit / sellingPrice) * 100;\n  return {\n    sellingPrice,\n    grossProfitDollars: grossProfit,\n    grossMarginPercent: Number(marginPct.toFixed(2)),\n    channel: isD2c ? 'DIRECT_TO_CONSUMER_D2C' : 'TRADITIONAL_WHOLESALE',\n    status: 'MARGIN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChannelMargin(100, 25, true)));\nconsole.log(JSON.stringify(calculateChannelMargin(100, 25, false)));",
            "expectedOutput": "{\"sellingPrice\":100,\"grossProfitDollars\":75,\"grossMarginPercent\":75,\"channel\":\"DIRECT_TO_CONSUMER_D2C\",\"status\":\"MARGIN_COMPUTED\"}\n{\"sellingPrice\":50,\"grossProfitDollars\":25,\"grossMarginPercent\":50,\"channel\":\"TRADITIONAL_WHOLESALE\",\"status\":\"MARGIN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the gross margin percentage achieved when a D2C brand sells a product for $100.00 that costs $25.00 to manufacture ($ (100 - 25) / 100 \\times 100 $)?",
          "expectedStringOutput": "75",
          "acceptableAnswers": [
            "75",
            "75%",
            "75.0",
            "grossMarginPercent\":75"
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "50% is traditional wholesale margin. Direct-to-Consumer captures the full retail price yielding 75.0% margin.",
              "recoveryPath": {
                "simplerExplanation": "100 - 25 = 75%.",
                "guidedFixPrompt": "Type 75"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d1-b2-five-ecommerce-transaction-models",
        "day": 1,
        "blockNumber": 2,
        "title": "The 5 E-Commerce Models: B2B, B2C, C2C, C2B & D2C",
        "conceptBudget": {
          "primaryConcept": "The 5 E-Commerce Transaction Models",
          "supportingTerms": [
            "B2B (Business-to-Business: Alibaba, Grainger, IndiaMART)",
            "B2C (Business-to-Consumer: Amazon, Walmart)",
            "C2C (Consumer-to-Consumer: eBay, OLX, Poshmark)",
            "C2B (Consumer-to-Business: Shutterstock photo licensing, Upwork freelancers)",
            "D2C (Direct-to-Consumer: Nike.com, Warby Parker, Glossier)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d1-b1-d2c-vs-wholesale-margin-advantage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Transaction Model Comparison",
            "codeSnippet": "// B2B: High order value ($10,000+), Net 30 invoices, bulk wholesale\n// B2C: Standard retail marketplace with 3rd-party merchant markups\n// D2C: Brand manufactures & sells directly to end-user with 0 middlemen!",
            "lineNotes": {
              "1": "Wholesale bulk trade.",
              "2": "Marketplace retail.",
              "3": "Sovereign direct brand."
            }
          },
          {
            "type": "runnable_code",
            "filename": "model_classify_demo.js",
            "initialCode": "function classifyCommerceModel(buyer, seller) {\n  if (seller === 'BRAND_MANUFACTURER' && buyer === 'END_CONSUMER') return 'D2C_DIRECT_TO_CONSUMER';\n  if (seller === 'BUSINESS' && buyer === 'BUSINESS') return 'B2B_BUSINESS_TO_BUSINESS';\n  return 'B2C_STANDARD_RETAIL';\n}\n\nconsole.log(classifyCommerceModel('END_CONSUMER', 'BRAND_MANUFACTURER'));\nconsole.log(classifyCommerceModel('BUSINESS', 'BUSINESS'));",
            "expectedOutput": "D2C_DIRECT_TO_CONSUMER\nB2B_BUSINESS_TO_BUSINESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an e-commerce model classified when a brand manufacturer sells products directly to end consumers through its own website?",
          "expectedStringOutput": "D2C_DIRECT_TO_CONSUMER",
          "acceptableAnswers": [
            "D2C_DIRECT_TO_CONSUMER",
            "D2C",
            "Direct to Consumer"
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "B2C": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "B2C includes retailers selling other brands. A brand selling its own products directly is D2C.",
              "recoveryPath": {
                "simplerExplanation": "Matches D2C_DIRECT_TO_CONSUMER.",
                "guidedFixPrompt": "Type D2C_DIRECT_TO_CONSUMER"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d1-b3-first-party-customer-data-ownership",
        "day": 1,
        "blockNumber": 3,
        "title": "First-Party Customer Data Ownership: Email, SMS & Repurchase Lifetime Value",
        "conceptBudget": {
          "primaryConcept": "First-Party Data Asset Invariant",
          "supportingTerms": [
            "Marketplaces conceal customer emails with masked relay addresses",
            "D2C owns 100% of customer phone, email, and browsing history for free automated email marketing retention"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d1-b2-five-ecommerce-transaction-models",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "data_ownership_demo.js",
            "initialCode": "function evaluateDataOwnership(isD2cStore) {\n  return isD2cStore\n    ? 'FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP'\n    : 'MASKED_RESTRICTED_MARKETPLACE_BUYER_DATA';\n}\n\nconsole.log(evaluateDataOwnership(true));\nconsole.log(evaluateDataOwnership(false));",
            "expectedOutput": "FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP\nMASKED_RESTRICTED_MARKETPLACE_BUYER_DATA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic data asset is captured when selling on a proprietary D2C storefront compared to selling on 3rd-party marketplaces?",
          "expectedStringOutput": "FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP",
          "acceptableAnswers": [
            "FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP",
            "First Party Data",
            "Full Data Ownership"
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "MASKED": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "Marketplaces mask data. D2C storefronts give full first-party customer data ownership.",
              "recoveryPath": {
                "simplerExplanation": "Matches FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP.",
                "guidedFixPrompt": "Type FULL_FIRST_PARTY_CUSTOMER_DATA_OWNERSHIP"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Product Catalog Architecture: SKU Matrix, Parent-Child Variants & Barcodes",
    "overviewMetaphor": "A Product Catalog Database is a Structured Family Tree of Unique Inventory DNA: The Parent Product is the abstract umbrella concept (e.g. 'Men's Organic Cotton Crewneck T-Shirt'); each unique combination of 4 Sizes (S, M, L, XL) and 3 Colors (Black, White, Blue) spawns a distinct Child Stock Keeping Unit ($4 \\times 3 = 12$ unique Child SKUs e.g. `TSHIRT-01-BLK-S`); each child SKU is assigned its own unique 13-digit EAN/UPC barcode, allowing warehouse barcode scanners to track exact physical inventory.",
    "blocks": [
      {
        "id": "ecom-d2-b1-sku-variant-matrix-generation",
        "day": 2,
        "blockNumber": 1,
        "title": "Parent-Child Variant SKU Matrix Generation ($N_{\\text{Sizes}} \\times N_{\\text{Colors}}$)",
        "conceptBudget": {
          "primaryConcept": "SKU Variant Matrix Formula",
          "supportingTerms": [
            "Parent SKU Code (`TSHIRT-01`)",
            "Sizes ($4$: S, M, L, XL)",
            "Colors ($3$: BLK, WHT, BLU)",
            "Total Child SKUs = $4 \\times 3 = 12$ unique variant records",
            "SKU Syntax: `PARENT-COLOR-SIZE` e.g. `TSHIRT-01-BLK-S`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d1-b1-d2c-vs-wholesale-margin-advantage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Product Catalog Matrix (4 Sizes x 3 Colors = 12 Child SKUs)",
              "boxes": [
                {
                  "label": "Parent Product Record",
                  "value": "TSHIRT-01 ('Men Organic Cotton Crewneck T-Shirt')",
                  "varType": "Parent",
                  "isUpdated": false
                },
                {
                  "label": "Variant Dimensions",
                  "value": "4 Sizes (S, M, L, XL) x 3 Colors (BLK, WHT, BLU)",
                  "varType": "Options",
                  "isUpdated": false
                },
                {
                  "label": "Generated Child SKUs",
                  "value": "12 Unique Inventory Records (TSHIRT-01-BLK-S ... BLU-XL)",
                  "varType": "Child SKUs",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sku_matrix_calc_demo.js",
            "initialCode": "function calculateChildSkus(sizesCount, colorsCount) {\n  const total = sizesCount * colorsCount;\n  return {\n    sizesCount,\n    colorsCount,\n    totalChildSkus: total,\n    status: 'SKUS_GENERATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChildSkus(4, 3)));",
            "expectedOutput": "{\"sizesCount\":4,\"colorsCount\":3,\"totalChildSkus\":12,\"status\":\"SKUS_GENERATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many distinct Child SKU inventory records are generated for a parent product available in 4 sizes and 3 colors ($4 \\times 3$)?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12 SKUs",
            "totalChildSkus\":12"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
          "diagnosisMap": {
            "7": {
              "misconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
              "errorExplanation": "7 adds 4 and 3. Variant matrices multiply options: 4 * 3 = 12 Child SKUs.",
              "recoveryPath": {
                "simplerExplanation": "4 * 3 = 12.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d2-b2-gtin-upc-ean13-barcodes",
        "day": 2,
        "blockNumber": 2,
        "title": "Barcoding Standards: UPC (12-Digit) vs EAN-13 (13-Digit) GTINs",
        "conceptBudget": {
          "primaryConcept": "GTIN Barcode Standards",
          "supportingTerms": [
            "UPC-A (Universal Product Code: 12 digits, North American standard)",
            "EAN-13 (European Article Number: 13 digits, Global international standard)",
            "GS1 Official Prefix Registration (Guarantees global barcode uniqueness)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d2-b1-sku-variant-matrix-generation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Barcode Standard Formats",
            "codeSnippet": "// UPC-A (North America): 12 Digits e.g. 012345678905\n// EAN-13 (International): 13 Digits e.g. 8901234567890 (GS1 Registered)",
            "lineNotes": {
              "1": "12-digit standard.",
              "2": "13-digit global standard."
            }
          },
          {
            "type": "runnable_code",
            "filename": "barcode_demo.js",
            "initialCode": "function getBarcodeDigitLength(barcodeStandard) {\n  return barcodeStandard === 'EAN_13' ? 13 : 12;\n}\n\nconsole.log(getBarcodeDigitLength('EAN_13'));\nconsole.log(getBarcodeDigitLength('UPC_A'));",
            "expectedOutput": "13\n12",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many digits compose a standard international EAN-13 Global Trade Item Number (GTIN) barcode?",
          "expectedStringOutput": "13",
          "acceptableAnswers": [
            "13",
            "13 digits",
            "Thirteen"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
          "diagnosisMap": {
            "12": {
              "misconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
              "errorExplanation": "12 digits is UPC-A. EAN-13 has 13 digits.",
              "recoveryPath": {
                "simplerExplanation": "EAN-13 has 13 digits.",
                "guidedFixPrompt": "Type 13"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d2-b3-category-taxonomy-breadcrumbs",
        "day": 2,
        "blockNumber": 3,
        "title": "Category Taxonomy Hierarchies & SEO Breadcrumbs",
        "conceptBudget": {
          "primaryConcept": "Category Hierarchy Invariant",
          "supportingTerms": [
            "Root Category $\\to$ Subcategory $\\to$ Child Category e.g. `Apparel > Men > Tops > T-Shirts`",
            "Enables intuitive faceted navigation and Google breadcrumb rich snippets"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d2-b2-gtin-upc-ean13-barcodes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "breadcrumb_demo.js",
            "initialCode": "function generateBreadcrumbs(categoriesArray) {\n  return categoriesArray.join(' > ');\n}\n\nconsole.log(generateBreadcrumbs(['Apparel', 'Men', 'Tops', 'T-Shirts']));",
            "expectedOutput": "Apparel > Men > Tops > T-Shirts",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What structured navigation string is produced from hierarchical categories `['Apparel', 'Men', 'Tops', 'T-Shirts']`?",
          "expectedStringOutput": "Apparel > Men > Tops > T-Shirts",
          "acceptableAnswers": [
            "Apparel > Men > Tops > T-Shirts",
            "Apparel > Men > Tops > T-Shirts"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
          "diagnosisMap": {
            "WRONG": {
              "misconceptionId": "MC_ECOM_PRODUCT_CATALOG_SKU_VARIANTS_TAXONOMY",
              "errorExplanation": "Matches Apparel > Men > Tops > T-Shirts.",
              "recoveryPath": {
                "simplerExplanation": "Joins with ' > ' separator.",
                "guidedFixPrompt": "Type Apparel > Men > Tops > T-Shirts"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "E-Commerce Pricing Strategies: Dynamic Pricing & Price Elasticity (Ed)",
    "overviewMetaphor": "Price Elasticity of Demand is a Rubber Band Measuring Customer Sensitivity: When a product priced at $100.00 sells 500 units ($50,000 revenue), dropping the price by 20% down to $80.00 causes demand to surge by 50% up to 750 units ($60,000 revenue); the Price Elasticity of Demand ($E_d = \\frac{+50\\%}{-20\\%} = -2.50$) is highly elastic ($|E_d| > 1.0$), proving that a price cut unlocks an extra $10,000 in net gross sales revenue.",
    "blocks": [
      {
        "id": "ecom-d3-b1-price-elasticity-of-demand-calculation",
        "day": 3,
        "blockNumber": 1,
        "title": "Price Elasticity of Demand: $E_d = \\frac{\\%\\Delta Q}{\\%\\Delta P}$ and Revenue Maximization",
        "conceptBudget": {
          "primaryConcept": "Price Elasticity Formula",
          "supportingTerms": [
            "Price Drop: $P_1 = \\$100 \\to P_2 = \\$80 \\implies -20.0\\%$",
            "Quantity Surge: $Q_1 = 500 \\to Q_2 = 750 \\implies +50.0\\%$",
            "$E_d = \\frac{+0.50}{-0.20} = -2.50$",
            "$|E_d| > 1.0 \\implies$ Price Elastic Demand (Revenue rises from $50,000 to $60,000!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d2-b1-sku-variant-matrix-generation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Elasticity Financial Ledger ($100 to $80 Price Cut)",
              "boxes": [
                {
                  "label": "Initial Sales Ledger",
                  "value": "500 units @ $100.00 = $50,000.00 Gross Sales",
                  "varType": "Initial Revenue",
                  "isUpdated": false
                },
                {
                  "label": "Price Discounted Ledger",
                  "value": "750 units @ $80.00 = $60,000.00 Gross Sales (+$10,000 REVENUE SURGE!)",
                  "varType": "New Revenue",
                  "isUpdated": false
                },
                {
                  "label": "Price Elasticity (Ed)",
                  "value": "50% / -20% = -2.50 (HIGHLY ELASTIC DEMAND -> EXPAND SALES!)",
                  "varType": "Elasticity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "elasticity_calc_demo.js",
            "initialCode": "function calculateElasticity(p1, p2, q1, q2) {\n  const pctP = (p2 - p1) / p1;\n  const pctQ = (q2 - q1) / q1;\n  const ed = pctQ / pctP;\n  return {\n    pctPriceChange: Number((pctP * 100).toFixed(1)),\n    pctQuantityChange: Number((pctQ * 100).toFixed(1)),\n    elasticityEd: Number(ed.toFixed(2)),\n    isElastic: Math.abs(ed) > 1.0,\n    status: 'ELASTICITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateElasticity(100, 80, 500, 750)));",
            "expectedOutput": "{\"pctPriceChange\":-20,\"pctQuantityChange\":50,\"elasticityEd\":-2.5,\"isElastic\":true,\"status\":\"ELASTICITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Price Elasticity of Demand (Ed) when a 20% price cut (-20%) triggers a 50% increase in order volume (+50%) ($ 50 / -20 $)?",
          "expectedStringOutput": "-2.5",
          "acceptableAnswers": [
            "-2.5",
            "-2.50",
            "elasticityEd\":-2.5"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
          "diagnosisMap": {
            "2.5": {
              "misconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
              "errorExplanation": "Price elasticity is negative because price and quantity move in opposite directions: 50 / -20 = -2.50.",
              "recoveryPath": {
                "simplerExplanation": "50 / -20 = -2.5.",
                "guidedFixPrompt": "Type -2.5"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d3-b2-dynamic-pricing-algorithms",
        "day": 3,
        "blockNumber": 2,
        "title": "Dynamic Pricing Algorithms: Competitor Matching & Inventory Velocity",
        "conceptBudget": {
          "primaryConcept": "Dynamic Pricing Rules Engine",
          "supportingTerms": [
            "Rule 1: If competitor stockout $\\implies$ Raise price by 10%",
            "Rule 2: If inventory velocity $< 2$ units/day $\\implies$ Lower price by 5%",
            "Automated hourly price adjustments via repricer bots"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d3-b1-price-elasticity-of-demand-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dynamic Pricing Logic",
            "codeSnippet": "// Competitor Out of Stock? -> PRICE_SURGE (+10% margin capture)\n// Fast Inventory Turnover?  -> MAINTAIN_PREMIUM\n// Slow Inventory Aging?     -> LIQUIDATION_DISCOUNT (-15% cash recovery)",
            "lineNotes": {
              "1": "Scarcity pricing.",
              "2": "Optimal velocity.",
              "3": "Cash flow protection."
            }
          },
          {
            "type": "runnable_code",
            "filename": "repricer_demo.js",
            "initialCode": "function evaluateRepricer(competitorOutOfStock, daysOfSupply) {\n  if (competitorOutOfStock) return 'SURGE_PRICE_CAPTURE_EXTRA_MARGIN';\n  if (daysOfSupply > 90) return 'DISCOUNT_PRICE_ACCELERATE_LIQUIDATION';\n  return 'MAINTAIN_STANDARD_MSRP';\n}\n\nconsole.log(evaluateRepricer(true, 30));\nconsole.log(evaluateRepricer(false, 120));",
            "expectedOutput": "SURGE_PRICE_CAPTURE_EXTRA_MARGIN\nDISCOUNT_PRICE_ACCELERATE_LIQUIDATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dynamic pricing action is executed when your primary competitor runs out of inventory on a high-demand product?",
          "expectedStringOutput": "SURGE_PRICE_CAPTURE_EXTRA_MARGIN",
          "acceptableAnswers": [
            "SURGE_PRICE_CAPTURE_EXTRA_MARGIN",
            "Surge Price",
            "Raise Price"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
          "diagnosisMap": {
            "DISCOUNT": {
              "misconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
              "errorExplanation": "When competitors stock out, you have market monopoly power. Dynamic repricers surge price to capture extra margin.",
              "recoveryPath": {
                "simplerExplanation": "Matches SURGE_PRICE_CAPTURE_EXTRA_MARGIN.",
                "guidedFixPrompt": "Type SURGE_PRICE_CAPTURE_EXTRA_MARGIN"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d3-b3-tiered-quantity-bundle-discounts",
        "day": 3,
        "blockNumber": 3,
        "title": "Tiered Quantity Bundling: Boosting Average Order Value (AOV)",
        "conceptBudget": {
          "primaryConcept": "Quantity Tier Discounting",
          "supportingTerms": [
            "Buy 1 for $30, Buy 2 for $50 ($25 each), Buy 3 for $65 ($21.66 each)",
            "Increases AOV by 35% while absorbing fixed shipping costs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d3-b2-dynamic-pricing-algorithms",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bundle_demo.js",
            "initialCode": "function calculateBundlePrice(units) {\n  if (units >= 3) return units * 21.67;\n  if (units === 2) return 50.0;\n  return 30.0;\n}\n\nconsole.log(calculateBundlePrice(2));\nconsole.log(calculateBundlePrice(1));",
            "expectedOutput": "50\n30",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the checkout price when a customer selects the 'Buy 2 Pack' bundle discount tier in the e-commerce store?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "$50",
            "50.0",
            "$50.00"
          ],
          "primaryMisconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_ECOM_PRICING_DYNAMIC_ELASTICITY_MAP",
              "errorExplanation": "60 is buying two at full single price ($30 x 2). The bundled price is $50.",
              "recoveryPath": {
                "simplerExplanation": "Bundle price for 2 is $50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Online Store UX & Information Architecture: High-Converting PDP & Sticky Buy Box",
    "overviewMetaphor": "The Product Detail Page (PDP) is an Expert Sales Consultant Handing the Product Directly to the Customer: A high-converting PDP features high-res image zoom, clear variant selectors, verified 5-star customer reviews, real-time scarcity badges ('Only 3 left in stock!'), and a Sticky Mobile 'Add to Cart' Bar that remains pinned to the bottom of the screen as the user scrolls, eliminating all buying friction.",
    "blocks": [
      {
        "id": "ecom-d4-b1-sticky-buy-box-mobile-conversion",
        "day": 4,
        "blockNumber": 1,
        "title": "The Sticky Mobile 'Add to Cart' Bar & 15% Mobile Conversion Uplift",
        "conceptBudget": {
          "primaryConcept": "Sticky Buy Box Mechanics",
          "supportingTerms": [
            "Mobile viewport scrolling hides standard CTA button above fold",
            "Sticky Bottom Buy Box pins Price + CTA button permanently to screen bottom",
            "Increases mobile checkout initiation by 15-22%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d3-b1-price-elasticity-of-demand-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile PDP UX Anatomy",
              "boxes": [
                {
                  "label": "Image Carousel & Zoom",
                  "value": "6 High-res product images with pinch-to-zoom",
                  "varType": "Visual Proof",
                  "isUpdated": false
                },
                {
                  "label": "Scarcity Badge",
                  "value": "'Only 3 Units Left in Stock' -> Activates urgency instinct",
                  "varType": "Scarcity",
                  "isUpdated": false
                },
                {
                  "label": "Sticky Bottom Bar",
                  "value": "PINNED: '$80.00 | ADD TO CART' (Always 1-tap accessible!)",
                  "varType": "Sticky CTA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sticky_pdp_demo.js",
            "initialCode": "function evaluateMobilePdpUx(hasStickyBar) {\n  return hasStickyBar\n    ? 'STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION'\n    : 'DISJOINTED_SCROLL_DROPOFF';\n}\n\nconsole.log(evaluateMobilePdpUx(true));\nconsole.log(evaluateMobilePdpUx(false));",
            "expectedOutput": "STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION\nDISJOINTED_SCROLL_DROPOFF",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mobile UX feature keeps the 'Add to Cart' button permanently visible and accessible at the bottom of the smartphone screen during scrolling?",
          "expectedStringOutput": "STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION",
          "acceptableAnswers": [
            "STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION",
            "Sticky Buy Box",
            "Sticky Add to Cart"
          ],
          "primaryMisconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
          "diagnosisMap": {
            "DISJOINTED": {
              "misconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
              "errorExplanation": "Missing sticky bars cause disjointed drop-off. Pinned bars achieve optimal mobile conversion.",
              "recoveryPath": {
                "simplerExplanation": "Matches STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION.",
                "guidedFixPrompt": "Type STICKY_BUY_BOX_OPTIMAL_MOBILE_CONVERSION"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d4-b2-social-proof-customer-reviews-ugc",
        "day": 4,
        "blockNumber": 2,
        "title": "Verified Customer Reviews & User Generated Content (UGC) Photo Grids",
        "conceptBudget": {
          "primaryConcept": "Customer Review Social Proof",
          "supportingTerms": [
            "Verified Buyer Badge",
            "Customer photo upload galleries (Increases conversion by 30% over studio photos)",
            "Star Rating Summary Distribution (5-star, 4-star breakdown)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d4-b1-sticky-buy-box-mobile-conversion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Review Trust Signals",
            "codeSnippet": "// ★★★★★ 4.9 out of 5 (1,250 Verified Buyer Reviews)\n// 📸 Customer Photo Grid: Real users wearing product in natural lighting!\n// Q&A Accordion: Instant answers to sizing and fabric questions",
            "lineNotes": {
              "1": "Aggregate star rating.",
              "2": "Authentic visual proof.",
              "3": "Objection handling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ugc_reviews_demo.js",
            "initialCode": "function getHighConvertingReviewAsset() {\n  return 'VERIFIED_BUYER_PHOTO_REVIEWS_GRID';\n}\n\nconsole.log(getHighConvertingReviewAsset());",
            "expectedOutput": "VERIFIED_BUYER_PHOTO_REVIEWS_GRID",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user-generated content review asset delivers the highest trust and conversion uplift on an e-commerce PDP?",
          "expectedStringOutput": "VERIFIED_BUYER_PHOTO_REVIEWS_GRID",
          "acceptableAnswers": [
            "VERIFIED_BUYER_PHOTO_REVIEWS_GRID",
            "Photo Reviews",
            "Customer Photo Reviews"
          ],
          "primaryMisconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
          "diagnosisMap": {
            "TEXT_ONLY": {
              "misconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
              "errorExplanation": "Text reviews can feel fake. Verified buyer photo grids provide indisputable proof.",
              "recoveryPath": {
                "simplerExplanation": "Matches VERIFIED_BUYER_PHOTO_REVIEWS_GRID.",
                "guidedFixPrompt": "Type VERIFIED_BUYER_PHOTO_REVIEWS_GRID"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d4-b3-scarcity-urgency-inventory-badges",
        "day": 4,
        "blockNumber": 3,
        "title": "Real-Time Scarcity & Shipping Countdown Timers",
        "conceptBudget": {
          "primaryConcept": "Ethical Scarcity Timers",
          "supportingTerms": [
            "Real inventory integration ('Only 3 left in stock!')",
            "Shipping countdown ('Order in next 2h 15m for same-day dispatch!')",
            "Activates behavioral loss aversion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d4-b2-social-proof-customer-reviews-ugc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scarcity_demo.js",
            "initialCode": "function getScarcityBadge(stockCount) {\n  return stockCount <= 5\n    ? `URGENT_SCARCITY_ONLY_${stockCount}_LEFT`\n    : 'STANDARD_IN_STOCK';\n}\n\nconsole.log(getScarcityBadge(3));\nconsole.log(getScarcityBadge(50));",
            "expectedOutput": "URGENT_SCARCITY_ONLY_3_LEFT\nSTANDARD_IN_STOCK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What urgency badge is rendered on a PDP when physical warehouse inventory drops to 3 remaining units?",
          "expectedStringOutput": "URGENT_SCARCITY_ONLY_3_LEFT",
          "acceptableAnswers": [
            "URGENT_SCARCITY_ONLY_3_LEFT",
            "Only 3 left",
            "Urgent Scarcity"
          ],
          "primaryMisconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_ECOM_STORE_UX_PDP_STICKY_BUY_BOX",
              "errorExplanation": "Stock <= 5 renders an urgent scarcity badge.",
              "recoveryPath": {
                "simplerExplanation": "Matches URGENT_SCARCITY_ONLY_3_LEFT.",
                "guidedFixPrompt": "Type URGENT_SCARCITY_ONLY_3_LEFT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign e-commerce merchandising and catalog architecture suite: 1. D2C channel margin calculation ($75.0\\%$ vs $50\\%$ wholesale); 2. Parent-Child SKU variant matrix synthesis ($12$ child SKUs); 3. Price elasticity of demand calculation ($E_d = -2.50$); 4. High-converting PDP UX audit validation (Sticky buy box & photo reviews).",
    "blocks": [
      {
        "id": "ecom-d5-b1-catalog-merchandising-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "E-Commerce Catalog & Merchandising Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Catalog & Merchandising Engine Synthesis",
          "supportingTerms": [
            "Margin Engine",
            "SKU Matrix Generator",
            "Elasticity Calculator",
            "PDP UX Auditor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d4-b3-scarcity-urgency-inventory-badges",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Catalog Merchandising Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates D2C 75% gross margin advantage",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Generates 12 Child SKU parent-child variant matrix",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Calculates -2.50 Price Elasticity of Demand revenue surge",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Audits PDP sticky buy box and certifies catalog engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "catalog_merchandising_kernel_demo.js",
            "initialCode": "function runCatalogMerchandisingEngine() {\n  return {\n    marginSubsystem: 'ONLINE_D2C_MARGINS_ACTIVE',\n    skuSubsystem: 'ONLINE_SKU_MATRIX_ACTIVE',\n    elasticitySubsystem: 'ONLINE_ELASTICITY_ACTIVE',\n    pdpSubsystem: 'ONLINE_STICKY_BUY_BOX_ACTIVE',\n    engineStatus: 'ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runCatalogMerchandisingEngine().engineStatus);",
            "expectedOutput": "ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the E-Commerce Catalog & Merchandising Master Kernel?",
          "expectedStringOutput": "ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "Matches ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ECOMMERCE_CATALOG_AND_MERCHANDISING_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d5-b2-catalog-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Catalog Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Catalog Invariant Verification",
          "supportingTerms": [
            "Margin Invariant",
            "SKU Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d5-b1-catalog-merchandising-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "catalog_audit_demo.js",
            "initialCode": "function auditCatalogEngine(marginValid, skuValid, edValid, pdpValid) {\n  const passed = marginValid && skuValid && edValid && pdpValid;\n  return {\n    marginVerified: marginValid,\n    skuVerified: skuValid,\n    elasticityVerified: edValid,\n    pdpVerified: pdpValid,\n    grade: passed ? 'CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCatalogEngine(true, true, true, true)));",
            "expectedOutput": "{\"marginVerified\":true,\"skuVerified\":true,\"elasticityVerified\":true,\"pdpVerified\":true,\"grade\":\"CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Margin, SKU, Elasticity, and PDP engines pass 100%?",
          "expectedStringOutput": "CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED",
            "grade\":\"CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "All checks passing awards CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CATALOG_MERCHANDISING_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d5-b3-milestone1-ecom-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 E-Commerce Catalog & Merchandising Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Catalog Architecture Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d5-b2-catalog-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_ecom_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_BUSINESS_MODELS_D2C_MARGINS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete E-Commerce Catalog, Pricing & PDP Architecture Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Checkout Flow & Payment Gateway Engineering: 1-Page Checkout & MDR (1.5-2%)",
    "overviewMetaphor": "The Checkout Flow is a High-Speed Airport Express Lane: Forcing shoppers to fill out 5 separate pages and create an account causes 70% cart abandonment; a modern 1-Page Checkout with Guest Checkout and address auto-fill lets shoppers pay in 20 seconds; Payment Gateways (Stripe, Razorpay) charge a 2.0% Merchant Discount Rate (MDR) plus $0.30 fixed fee; on a $1,000 checkout order, the gateway fee is $20.30, and the merchant receives a clean $979.70 net bank settlement.",
    "blocks": [
      {
        "id": "ecom-d6-b1-payment-gateway-mdr-settlement",
        "day": 6,
        "blockNumber": 1,
        "title": "Payment Gateway MDR Deduction & Net Settlement: $\\text{Net} = \\text{Total} - (\\text{Total} \\times \\text{MDR}\\% + \\text{Fixed Fee})$",
        "conceptBudget": {
          "primaryConcept": "Payment Settlement Formula",
          "supportingTerms": [
            "Gross Cart Total ($1,000.00)",
            "MDR % ($2.0\\% \\implies \\$20.00$ variable processing fee)",
            "Fixed Transaction Fee ($0.30)",
            "Total Processing Fee = $20.30",
            "Net Merchant Settlement = $1,000 - $20.30 = \\$979.70$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d1-b1-d2c-vs-wholesale-margin-advantage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Payment Settlement Ledger ($1,000 Order, 2.0% MDR + $0.30 Fee)",
              "boxes": [
                {
                  "label": "Customer Payment Total",
                  "value": "$1,000.00 Charged to Customer Card/UPI",
                  "varType": "Gross",
                  "isUpdated": false
                },
                {
                  "label": "Gateway MDR & Fixed Fee",
                  "value": "$20.00 (2% MDR) + $0.30 = $20.30 Processing Fee",
                  "varType": "Gateway Fee",
                  "isUpdated": false
                },
                {
                  "label": "Net Bank Settlement",
                  "value": "$1,000.00 - $20.30 = $979.70 Deposited to Merchant Bank Account!",
                  "varType": "Net Cash",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "payment_settle_calc_demo.js",
            "initialCode": "function calculateNetSettlement(grossTotal, mdrPct, fixedFee) {\n  const mdr = grossTotal * (mdrPct / 100);\n  const totalFee = mdr + fixedFee;\n  const net = grossTotal - totalFee;\n  return {\n    grossTotal,\n    totalFee: Number(totalFee.toFixed(2)),\n    netSettlement: Number(net.toFixed(2)),\n    status: 'PAYMENT_SETTLED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNetSettlement(1000, 2.0, 0.30)));",
            "expectedOutput": "{\"grossTotal\":1000,\"totalFee\":20.3,\"netSettlement\":979.7,\"status\":\"PAYMENT_SETTLED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net dollar settlement deposited to the merchant bank account from a $1,000 order after deducting a 2.0% MDR and a $0.30 fixed fee ($1,000 - 20.30$)?",
          "expectedStringOutput": "979.7",
          "acceptableAnswers": [
            "979.7",
            "979.70",
            "$979.70",
            "netSettlement\":979.7"
          ],
          "primaryMisconceptionId": "MC_ECOM_PAYMENT_GATEWAY_MDR_3DS_SECURITY",
          "diagnosisMap": {
            "980": {
              "misconceptionId": "MC_ECOM_PAYMENT_GATEWAY_MDR_3DS_SECURITY",
              "errorExplanation": "980 forgets the $0.30 fixed transaction fee. The net settlement is $979.70.",
              "recoveryPath": {
                "simplerExplanation": "1,000 - 20.30 = 979.70.",
                "guidedFixPrompt": "Type 979.7"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d6-b2-guest-checkout-vs-forced-registration",
        "day": 6,
        "blockNumber": 2,
        "title": "Guest Checkout vs Forced Account Creation (The $300M Button Lesson)",
        "conceptBudget": {
          "primaryConcept": "Guest Checkout Invariant",
          "supportingTerms": [
            "Forced Registration (Demanding username/password creation before paying causes 35% abandonment)",
            "Guest Checkout (Capturing email/phone at payment and auto-creating account in background)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d6-b1-payment-gateway-mdr-settlement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Checkout Flow Best Practice",
            "codeSnippet": "// ❌ FORCED REGISTRATION: 'Please create password with 1 symbol and 1 uppercase letter' -> 35% BOUNCE!\n// ✅ GUEST CHECKOUT:      1-click email input + Apple Pay / UPI -> Instant order completion!",
            "lineNotes": {
              "1": "High checkout friction.",
              "2": "Frictionless conversion."
            }
          },
          {
            "type": "runnable_code",
            "filename": "guest_checkout_demo.js",
            "initialCode": "function evaluateCheckoutFlow(hasGuestCheckout) {\n  return hasGuestCheckout\n    ? 'FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION'\n    : 'FORCED_REGISTRATION_35_PERCENT_ABANDONMENT';\n}\n\nconsole.log(evaluateCheckoutFlow(true));\nconsole.log(evaluateCheckoutFlow(false));",
            "expectedOutput": "FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION\nFORCED_REGISTRATION_35_PERCENT_ABANDONMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which checkout configuration eliminates friction by allowing new buyers to complete orders without forcing upfront password registration?",
          "expectedStringOutput": "FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION",
          "acceptableAnswers": [
            "FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION",
            "Guest Checkout",
            "Guest checkout"
          ],
          "primaryMisconceptionId": "MC_ECOM_CHECKOUT_FRICTION_ONE_PAGE_FLOW",
          "diagnosisMap": {
            "FORCED": {
              "misconceptionId": "MC_ECOM_CHECKOUT_FRICTION_ONE_PAGE_FLOW",
              "errorExplanation": "Forced registration causes 35% cart abandonment. Guest checkout maximizes conversion.",
              "recoveryPath": {
                "simplerExplanation": "Matches FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION.",
                "guidedFixPrompt": "Type FRICTIONLESS_GUEST_CHECKOUT_MAX_CONVERSION"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d6-b3-three-d-secure-2-liability-shift",
        "day": 3,
        "blockNumber": 3,
        "title": "3D Secure 2.0 (3DS2) & Fraud Chargeback Liability Shift",
        "conceptBudget": {
          "primaryConcept": "3DS2 Liability Shift",
          "supportingTerms": [
            "3DS2 (Frictionless biometric authentication via OTP or banking app)",
            "Liability Shift (When 3DS passes, the issuing bank absorbs stolen card fraud loss instead of the merchant!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d6-b2-guest-checkout-vs-forced-registration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "three_ds_demo.js",
            "initialCode": "function evaluateFraudLiability(has3dsAuthenticated) {\n  return has3dsAuthenticated\n    ? 'FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK'\n    : 'MERCHANT_BEARS_FULL_FRAUD_CHARGEBACK_LOSS';\n}\n\nconsole.log(evaluateFraudLiability(true));\nconsole.log(evaluateFraudLiability(false));",
            "expectedOutput": "FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK\nMERCHANT_BEARS_FULL_FRAUD_CHARGEBACK_LOSS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who legally absorbs the financial loss for stolen card fraud when an e-commerce transaction is verified through 3D Secure (3DS2) authentication?",
          "expectedStringOutput": "FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK",
          "acceptableAnswers": [
            "FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK",
            "Issuing Bank",
            "The Bank"
          ],
          "primaryMisconceptionId": "MC_ECOM_PAYMENT_GATEWAY_MDR_3DS_SECURITY",
          "diagnosisMap": {
            "MERCHANT": {
              "misconceptionId": "MC_ECOM_PAYMENT_GATEWAY_MDR_3DS_SECURITY",
              "errorExplanation": "Without 3DS the merchant bears the loss. With 3DS authentication, liability shifts to the issuing bank.",
              "recoveryPath": {
                "simplerExplanation": "Matches FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK.",
                "guidedFixPrompt": "Type FRAUD_LIABILITY_SHIFTS_TO_ISSUING_BANK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Order Management Systems (OMS): State Machine & Split Shipments",
    "overviewMetaphor": "An Order Management System is an Automated Airport Baggage Conveyor System: An order flows through a strict sequential state machine (`PENDING_PAYMENT` $\\to$ `PAID` $\\to$ `PROCESSING_PICK_PACK` $\\to$ `SHIPPED` $\\to$ `OUT_FOR_DELIVERY` $\\to$ `DELIVERED`); illegal jumps (e.g. attempting to ship an unpaid order) are immediately rejected by database state constraints, guaranteeing zero inventory shrinkage and zero double-fulfillments.",
    "blocks": [
      {
        "id": "ecom-d7-b1-oms-state-machine-transitions",
        "day": 7,
        "blockNumber": 1,
        "title": "The 6-Stage OMS Finite State Machine (FSM)",
        "conceptBudget": {
          "primaryConcept": "OMS State Machine Transitions",
          "supportingTerms": [
            "State 1: `PENDING_PAYMENT`",
            "State 2: `PAID`",
            "State 3: `PROCESSING_PICK_PACK`",
            "State 4: `SHIPPED`",
            "State 5: `OUT_FOR_DELIVERY`",
            "State 6: `DELIVERED`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d6-b1-payment-gateway-mdr-settlement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "OMS Lifecycle State Transition Table",
              "boxes": [
                {
                  "label": "Current State: `PAID`",
                  "value": "Event: `START_FULFILLMENT` -> Next: `PROCESSING_PICK_PACK` (VALID)",
                  "varType": "Valid Step",
                  "isUpdated": false
                },
                {
                  "label": "Current State: `PROCESSING`",
                  "value": "Event: `MANIFEST_GENERATED` -> Next: `SHIPPED` (VALID)",
                  "varType": "Valid Step",
                  "isUpdated": false
                },
                {
                  "label": "Illegal Transition Attempt",
                  "value": "`PENDING_PAYMENT` -> `SHIPPED` -> `INVALID_TRANSITION_REJECTED`!",
                  "varType": "Constraint",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "oms_fsm_demo.js",
            "initialCode": "function transitionOms(current, event) {\n  if (current === 'PAID' && event === 'START_FULFILLMENT') return 'PROCESSING_PICK_PACK';\n  if (current === 'PROCESSING_PICK_PACK' && event === 'MANIFEST_GENERATED') return 'SHIPPED';\n  if (current === 'SHIPPED' && event === 'REACHED_LOCAL_HUB') return 'OUT_FOR_DELIVERY';\n  if (current === 'OUT_FOR_DELIVERY' && event === 'CUSTOMER_SIGNATURE') return 'DELIVERED';\n  return 'INVALID_TRANSITION_REJECTED';\n}\n\nconsole.log(transitionOms('PAID', 'START_FULFILLMENT'));\nconsole.log(transitionOms('PENDING_PAYMENT', 'MANIFEST_GENERATED'));",
            "expectedOutput": "PROCESSING_PICK_PACK\nINVALID_TRANSITION_REJECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What next state is transitioned when an order in 'PAID' status receives the 'START_FULFILLMENT' event trigger?",
          "expectedStringOutput": "PROCESSING_PICK_PACK",
          "acceptableAnswers": [
            "PROCESSING_PICK_PACK",
            "Processing Pick Pack",
            "Processing"
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "SHIPPED": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "An order must first be picked and packed in the warehouse before being marked as SHIPPED.",
              "recoveryPath": {
                "simplerExplanation": "Next state is PROCESSING_PICK_PACK.",
                "guidedFixPrompt": "Type PROCESSING_PICK_PACK"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d7-b2-multi-warehouse-split-shipments",
        "day": 7,
        "blockNumber": 2,
        "title": "Multi-Warehouse Inventory Allocation & Split Shipment Rules",
        "conceptBudget": {
          "primaryConcept": "Split Shipment Allocation",
          "supportingTerms": [
            "Item A in Mumbai Warehouse, Item B in Delhi Warehouse",
            "OMS splits order into 2 distinct sub-shipments with independent tracking numbers",
            "Balances customer delivery speed vs dual freight costs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d7-b1-oms-state-machine-transitions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Split Shipment Logic",
            "codeSnippet": "// Order #1234 (Item A + Item B)\n// -> Sub-order 1234-A: Fulfilled from MUMBAI Hub (Air Express -> 1 Day)\n// -> Sub-order 1234-B: Fulfilled from DELHI Hub (Surface Transit -> 3 Days)",
            "lineNotes": {
              "2": "Sub-shipment 1.",
              "3": "Sub-shipment 2."
            }
          },
          {
            "type": "runnable_code",
            "filename": "split_shipment_demo.js",
            "initialCode": "function evaluateSplitShipment(item1Warehouse, item2Warehouse) {\n  return item1Warehouse !== item2Warehouse\n    ? 'SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS'\n    : 'SINGLE_CONSOLIDATED_SHIPMENT';\n}\n\nconsole.log(evaluateSplitShipment('WH_MUMBAI', 'WH_DELHI'));\nconsole.log(evaluateSplitShipment('WH_MUMBAI', 'WH_MUMBAI'));",
            "expectedOutput": "SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS\nSINGLE_CONSOLIDATED_SHIPMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fulfillment action is triggered by the OMS when items in a single customer order are located in two different regional fulfillment warehouses?",
          "expectedStringOutput": "SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS",
          "acceptableAnswers": [
            "SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS",
            "Split Shipment",
            "Split order"
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "CANCEL": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "Orders are not cancelled. The OMS splits the order into two independent shipments.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS.",
                "guidedFixPrompt": "Type SPLIT_ORDER_INTO_TWO_INDEPENDENT_SHIPMENTS"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d7-b3-webhook-tracking-updates",
        "day": 7,
        "blockNumber": 3,
        "title": "Logistics Carrier Webhook Ingestion & Automated Customer Notifications",
        "conceptBudget": {
          "primaryConcept": "Carrier Webhook Ingestion",
          "supportingTerms": [
            "Carrier pushes HTTP POST webhook upon scan (e.g. `OUT_FOR_DELIVERY`)",
            "OMS triggers instant WhatsApp/SMS notification with live driver tracking link"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d7-b2-multi-warehouse-split-shipments",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "webhook_demo.js",
            "initialCode": "function handleCarrierWebhook(event) {\n  return event === 'OUT_FOR_DELIVERY'\n    ? 'TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT'\n    : 'UPDATE_DATABASE_INTERNAL_LOGS';\n}\n\nconsole.log(handleCarrierWebhook('OUT_FOR_DELIVERY'));",
            "expectedOutput": "TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What customer engagement action is immediately executed when a 3PL logistics webhook posts an 'OUT_FOR_DELIVERY' event?",
          "expectedStringOutput": "TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT",
          "acceptableAnswers": [
            "TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT",
            "WhatsApp Alert",
            "Customer Alert"
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "Real-time tracking notifications reduce delivery failure. It triggers an instant WhatsApp alert.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT.",
                "guidedFixPrompt": "Type TRIGGER_INSTANT_WHATSAPP_CUSTOMER_OUT_FOR_DELIVERY_ALERT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Inventory Management & Stockouts: Safety Stock & Reorder Point (ROP)",
    "overviewMetaphor": "The Reorder Point is a Car's Low Fuel Warning Light Triggered Before You Run Dry on the Highway: If you sell 50 units/day ($D = 50$) and the supplier takes 10 days to manufacture and deliver new stock ($L = 10$), you will sell 500 units during the lead time ($D \\times L = 500$); keeping 150 units of Safety Stock ($SS = 150$) protects against holiday demand spikes; your Reorder Point is $ROP = (50 \\times 10) + 150 = 650$ units; the exact moment your warehouse inventory drops to 650 units, the system automatically fires a purchase order to prevent running out of stock.",
    "blocks": [
      {
        "id": "ecom-d8-b1-reorder-point-formula-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "The Reorder Point (ROP) Formula: $ROP = (\\text{Daily Demand } D \\times \\text{Lead Time } L) + \\text{Safety Stock } SS$",
        "conceptBudget": {
          "primaryConcept": "Reorder Point Formula",
          "supportingTerms": [
            "Daily Demand ($D = 50$ units/day)",
            "Supplier Lead Time ($L = 10$ days)",
            "Lead Time Demand ($D \\times L = 500$ units)",
            "Safety Stock ($SS = 150$ units)",
            "$ROP = 500 + 150 = 650$ units"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d7-b1-oms-state-machine-transitions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Inventory ROP Ledger (D = 50/day, L = 10 days, SS = 150 units)",
              "boxes": [
                {
                  "label": "Lead Time Consumption",
                  "value": "50 units/day x 10 days = 500 units consumed in transit",
                  "varType": "Lead Demand",
                  "isUpdated": false
                },
                {
                  "label": "Safety Stock Buffer",
                  "value": "150 units reserve buffer (Absorbs unexpected viral spikes)",
                  "varType": "Buffer",
                  "isUpdated": false
                },
                {
                  "label": "Reorder Point (ROP)",
                  "value": "500 + 150 = 650 UNITS (AUTOMATED PURCHASE ORDER TRIGGER!)",
                  "varType": "ROP Trigger",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rop_calc_demo.js",
            "initialCode": "function calculateRop(dailyDemand, leadTimeDays, safetyStock) {\n  const leadDemand = dailyDemand * leadTimeDays;\n  const rop = leadDemand + safetyStock;\n  return {\n    leadTimeDemand: leadDemand,\n    safetyStock,\n    reorderPoint: rop,\n    trigger: `REORDER_AT_${rop}_UNITS`,\n    status: 'ROP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRop(50, 10, 150)));",
            "expectedOutput": "{\"leadTimeDemand\":500,\"safetyStock\":150,\"reorderPoint\":650,\"trigger\":\"REORDER_AT_650_UNITS\",\"status\":\"ROP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Reorder Point (ROP) in units when Daily Demand is 50 units, Supplier Lead Time is 10 days, and Safety Stock is 150 units ($ (50 \\times 10) + 150 $)?",
          "expectedStringOutput": "650",
          "acceptableAnswers": [
            "650",
            "650 units",
            "reorderPoint\":650"
          ],
          "primaryMisconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
              "errorExplanation": "500 is lead time demand only. ROP must add the 150 unit safety stock buffer: 500 + 150 = 650 units.",
              "recoveryPath": {
                "simplerExplanation": "(50 * 10) + 150 = 650.",
                "guidedFixPrompt": "Type 650"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d8-b2-economic-order-quantity-eoq",
        "day": 8,
        "blockNumber": 2,
        "title": "Economic Order Quantity (EOQ): Balancing Ordering Costs & Holding Costs",
        "conceptBudget": {
          "primaryConcept": "Economic Order Quantity Formula",
          "supportingTerms": [
            "$EOQ = \\sqrt{\\frac{2 \\times D \\times S}{H}}$",
            "Annual Demand ($D$)",
            "Fixed Order Cost ($S$)",
            "Annual Holding Cost per Unit ($H$)",
            "Minimizes total inventory management cost"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d8-b1-reorder-point-formula-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EOQ Cost Balance",
            "codeSnippet": "// Small frequent orders -> Low holding cost, but high ordering & freight fees!\n// Massive bulk orders    -> Low ordering cost, but massive warehouse holding costs!\n// EOQ                   -> The exact mathematical sweet spot minimizing total cost!",
            "lineNotes": {
              "1": "High ordering cost.",
              "2": "High storage holding cost.",
              "3": "Optimal cost minimum."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eoq_demo.js",
            "initialCode": "function calculateEoq(annualDemand, orderCost, holdingCost) {\n  const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost);\n  return Math.round(eoq);\n}\n\nconsole.log(calculateEoq(10000, 50, 4));",
            "expectedOutput": "500",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Economic Order Quantity (EOQ) in units when Annual Demand is 10,000, Order Cost is $50, and Holding Cost is $4/unit ($ \\sqrt{(2 \\times 10,000 \\times 50) / 4} = \\sqrt{250,000} $)?",
          "expectedStringOutput": "500",
          "acceptableAnswers": [
            "500",
            "500 units",
            "Five hundred"
          ],
          "primaryMisconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
          "diagnosisMap": {
            "250000": {
              "misconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
              "errorExplanation": "250,000 is under the square root. The square root of 250,000 is 500 units.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(250,000) = 500.",
                "guidedFixPrompt": "Type 500"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d8-b3-inventory-turnover-ratio-itr",
        "day": 8,
        "blockNumber": 3,
        "title": "Inventory Turnover Ratio (ITR): $\\text{ITR} = \\frac{\\text{COGS}}{\\text{Average Inventory}}$",
        "conceptBudget": {
          "primaryConcept": "Inventory Turnover Ratio Formula",
          "supportingTerms": [
            "$COGS = \\$600,000, \\text{Average Inventory} = \\$100,000 \\implies ITR = 6.0x$",
            "Days Sales of Inventory ($DSI = \\frac{365}{6.0} = 60.8$ days)",
            "Higher turnover ratio frees up corporate cash flow"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d8-b2-economic-order-quantity-eoq",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "itr_demo.js",
            "initialCode": "function calculateItr(cogs, avgInv) {\n  const itr = cogs / avgInv;\n  const dsi = 365 / itr;\n  return {\n    inventoryTurnoverRatio: Number(itr.toFixed(2)),\n    daysSalesOfInventory: Number(dsi.toFixed(1)),\n    status: 'ITR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateItr(600000, 100000)));",
            "expectedOutput": "{\"inventoryTurnoverRatio\":6,\"daysSalesOfInventory\":60.8,\"status\":\"ITR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Inventory Turnover Ratio (ITR) when annual Cost of Goods Sold is $600,000 and Average Inventory is $100,000 ($600,000 / 100,000$)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6.0",
            "6x",
            "6.0x",
            "inventoryTurnoverRatio\":6"
          ],
          "primaryMisconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
          "diagnosisMap": {
            "0.167": {
              "misconceptionId": "MC_ECOM_INVENTORY_SAFETY_STOCK_REORDER_POINT",
              "errorExplanation": "0.167 divides inventory by COGS. ITR divides COGS by Average Inventory: 600k / 100k = 6.0x.",
              "recoveryPath": {
                "simplerExplanation": "600,000 / 100,000 = 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Warehousing, Pick & Pack: Volumetric Weight (L x W x H / 5000)",
    "overviewMetaphor": "Volumetric Dimensional Weight is a Cargo Airplane Charging for the Empty Space Inside a Giant Feather Pillow: If you ship a giant $50 \\text{ cm} \\times 40 \\text{ cm} \\times 30 \\text{ cm}$ box containing lightweight foam packing peanuts (Actual Dead Weight = 2.0 kg), the courier calculates the IATA Volumetric Weight as $\\frac{50 \\times 40 \\times 30}{5000} = \\frac{60,000}{5000} = 12.0\\text{ kg}$; because 12.0 kg is greater than 2.0 kg, the carrier bills you on the 12.0 kg volumetric weight; optimizing box size cuts shipping costs by 60%.",
    "blocks": [
      {
        "id": "ecom-d9-b1-volumetric-chargeable-weight-calculation",
        "day": 9,
        "blockNumber": 1,
        "title": "IATA Volumetric Weight Formula: $\\text{Volumetric (kg)} = \\frac{L \\times W \\times H}{5000}$ & Chargeable Weight",
        "conceptBudget": {
          "primaryConcept": "Volumetric Weight Formula",
          "supportingTerms": [
            "Actual Weight ($2.0$ kg)",
            "Box Dimensions ($50 \\times 40 \\times 30 = 60,000 \\text{ cm}^3$)",
            "Volumetric Divisor ($5000$)",
            "$\\text{Volumetric Weight} = \\frac{60,000}{5000} = 12.0$ kg",
            "Chargeable Weight: $\\max(2.0, 12.0) = 12.0$ kg (Billed on Volumetric Weight)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d8-b1-reorder-point-formula-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Freight Weight Audit (50x40x30 cm, 2.0 kg Actual)",
              "boxes": [
                {
                  "label": "Actual Physical Weight",
                  "value": "2.00 kg Scale Weight (Dead weight)",
                  "varType": "Dead Weight",
                  "isUpdated": false
                },
                {
                  "label": "Volumetric Weight (5000 Divisor)",
                  "value": "(50 x 40 x 30) / 5000 = 12.00 kg Volumetric Weight",
                  "varType": "Volumetric",
                  "isUpdated": false
                },
                {
                  "label": "Carrier Chargeable Weight",
                  "value": "MAX(2.0, 12.0) = 12.00 kg (BILLED ON AIRPLANE CARGO VOLUME!)",
                  "varType": "Chargeable",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "volumetric_calc_demo.js",
            "initialCode": "function calculateVolumetricWeight(actualKg, l, w, h) {\n  const vol = (l * w * h) / 5000;\n  const chargeable = Math.max(actualKg, vol);\n  return {\n    actualKg,\n    volumetricKg: Number(vol.toFixed(2)),\n    chargeableKg: Number(chargeable.toFixed(2)),\n    isBilledVolumetric: vol > actualKg,\n    status: 'WEIGHT_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateVolumetricWeight(2.0, 50, 40, 30)));",
            "expectedOutput": "{\"actualKg\":2,\"volumetricKg\":12,\"chargeableKg\":12,\"isBilledVolumetric\":true,\"status\":\"WEIGHT_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the volumetric weight in kilograms for a carton measuring 50 cm x 40 cm x 30 cm using the standard 5000 divisor ($ (50 \\times 40 \\times 30) / 5000 $)?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12 kg",
            "12.0",
            "volumetricKg\":12"
          ],
          "primaryMisconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
              "errorExplanation": "60,000 is cubic centimeters volume. Dividing by 5000 gives 12.0 kg volumetric weight.",
              "recoveryPath": {
                "simplerExplanation": "60,000 / 5000 = 12.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d9-b2-warehouse-pick-and-pack-strategies",
        "day": 9,
        "blockNumber": 2,
        "title": "Warehouse Picking Methodologies: Zone, Wave & Batch Picking",
        "conceptBudget": {
          "primaryConcept": "Warehouse Picking Methods",
          "supportingTerms": [
            "Zone Picking (Pickers dedicated to specific warehouse aisles: 'Pick-and-Pass')",
            "Batch Picking (Picker gathers items for 20 orders in a single travel pass)",
            "Wave Picking (Orders scheduled in time windows aligned with courier truck departure departures)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d9-b1-volumetric-chargeable-weight-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Picking Method Selection",
            "codeSnippet": "// BATCH PICKING: 1 picker gathers 50 SKU units for 25 orders in 1 walk -> 4x faster!\n// WAVE PICKING:  Picks scheduled to match 4 PM FedEx truck departure deadline\n// ZONE PICKING:  Warehouse split into Refrigerated, Apparel, and Electronics zones",
            "lineNotes": {
              "1": "High travel efficiency.",
              "2": "Courier schedule matching.",
              "3": "Facility specialization."
            }
          },
          {
            "type": "runnable_code",
            "filename": "picking_demo.js",
            "initialCode": "function selectPickingMethod(isHighVolumeMultiOrder) {\n  return isHighVolumeMultiOrder\n    ? 'BATCH_PICKING_SINGLE_WALK_CONSOLIDATION'\n    : 'SINGLE_ORDER_DISCRETE_PICKING';\n}\n\nconsole.log(selectPickingMethod(true));",
            "expectedOutput": "BATCH_PICKING_SINGLE_WALK_CONSOLIDATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which warehouse picking strategy consolidates multiple customer orders into a single travel path to maximize picking efficiency?",
          "expectedStringOutput": "BATCH_PICKING_SINGLE_WALK_CONSOLIDATION",
          "acceptableAnswers": [
            "BATCH_PICKING_SINGLE_WALK_CONSOLIDATION",
            "Batch Picking",
            "Batch picking"
          ],
          "primaryMisconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
          "diagnosisMap": {
            "SINGLE": {
              "misconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
              "errorExplanation": "Single order picking has high walking wasted time. High-volume warehouses use Batch Picking.",
              "recoveryPath": {
                "simplerExplanation": "Matches BATCH_PICKING_SINGLE_WALK_CONSOLIDATION.",
                "guidedFixPrompt": "Type BATCH_PICKING_SINGLE_WALK_CONSOLIDATION"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d9-b3-barcode-scanner-pack-verification",
        "day": 9,
        "blockNumber": 3,
        "title": "Pack Station Barcode Verification & 99.9% Order Accuracy",
        "conceptBudget": {
          "primaryConcept": "Pack Verification Scan Invariant",
          "supportingTerms": [
            "Double Barcode Scan (Scanning item barcode + packing slip barcode before taping box)",
            "Prevents shipping wrong sizes or wrong items, eliminating 95% of customer return disputes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d9-b2-warehouse-pick-and-pack-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "barcode_scan_demo.js",
            "initialCode": "function verifyPackItem(scannedSku, expectedSku) {\n  return scannedSku === expectedSku\n    ? 'BARCODE_VERIFIED_PROCEED_TO_SEAL_BOX'\n    : 'MISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED';\n}\n\nconsole.log(verifyPackItem('TSHIRT-01-BLK-M', 'TSHIRT-01-BLK-M'));\nconsole.log(verifyPackItem('TSHIRT-01-WHT-L', 'TSHIRT-01-BLK-M'));",
            "expectedOutput": "BARCODE_VERIFIED_PROCEED_TO_SEAL_BOX\nMISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What system action is triggered at the packing station when a picker accidentally scans a White Large T-shirt for an order requesting a Black Medium T-shirt?",
          "expectedStringOutput": "MISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED",
          "acceptableAnswers": [
            "MISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED",
            "Mismatch error",
            "Halt wrong item"
          ],
          "primaryMisconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
          "diagnosisMap": {
            "SEAL": {
              "misconceptionId": "MC_ECOM_WAREHOUSING_VOLUMETRIC_WEIGHT_PICK_PACK",
              "errorExplanation": "Scanning wrong items halts packing immediately to prevent shipping errors.",
              "recoveryPath": {
                "simplerExplanation": "Matches MISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED.",
                "guidedFixPrompt": "Type MISMATCH_ERROR_HALT_WRONG_ITEM_DETECTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Logistics, 3PL Carriers & Cash on Delivery (COD) RTO Mitigation",
    "overviewMetaphor": "Cash on Delivery (COD) Return to Origin (RTO) is a Boomerang that Burns Money in Both Directions: When a shopper orders a COD package and refuses delivery at the door, you pay $50.00 for forward shipping AND $40.00 for return reverse shipping ($90.00 lost freight per RTO order); across 150 failed RTO orders (15.0% RTO rate), your business burns $13,500 in pure cash loss ($150 \\times \\$90$); implementing mandatory WhatsApp OTP phone confirmation before dispatch slashes RTO below 10.0%.",
    "blocks": [
      {
        "id": "ecom-d10-b1-cod-rto-freight-loss-calculation",
        "day": 10,
        "blockNumber": 1,
        "title": "COD Return to Origin (RTO) Rate & Total Freight Loss: $\\text{Lost Freight} = \\text{RTO Orders} \\times (\\text{Forward} + \\text{Return})$",
        "conceptBudget": {
          "primaryConcept": "RTO Freight Loss Formula",
          "supportingTerms": [
            "Total COD Orders ($1,000$)",
            "Delivered Orders ($850$)",
            "RTO Failed Orders ($150 \\implies 15.0\\%$ RTO Rate)",
            "Forward Shipping ($50.00$) + Return Reverse Shipping ($40.00$) = $90.00/order",
            "Total Lost Freight Cash = $150 \\times \\$90 = \\$13,500$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d9-b1-volumetric-chargeable-weight-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "COD RTO Financial Drain Ledger (150 Failed Deliveries @ $90 Freight)",
              "boxes": [
                {
                  "label": "Delivered Orders (850)",
                  "value": "850 Successful COD Customer Deliveries (85.0% Success)",
                  "varType": "Delivered",
                  "isUpdated": false
                },
                {
                  "label": "RTO Failed Orders (150)",
                  "value": "150 Refused at Doorstep Deliveries (15.0% RTO Rate > 10% Benchmark)",
                  "varType": "RTO Failures",
                  "isUpdated": false
                },
                {
                  "label": "Total Freight Cash Burn",
                  "value": "150 x ($50 Forward + $40 Reverse) = $13,500.00 LOST FREIGHT CASH!",
                  "varType": "Cash Burn",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rto_calc_demo.js",
            "initialCode": "function calculateRtoFreightLoss(totalOrders, deliveredOrders, forwardCost, returnCost) {\n  const rtoCount = totalOrders - deliveredOrders;\n  const rtoPct = (rtoCount / totalOrders) * 100;\n  const lostFreight = rtoCount * (forwardCost + returnCost);\n  return {\n    totalOrders,\n    rtoCount,\n    rtoPercent: Number(rtoPct.toFixed(2)),\n    totalLostFreightDollars: lostFreight,\n    status: 'RTO_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRtoFreightLoss(1000, 850, 50, 40)));",
            "expectedOutput": "{\"totalOrders\":1000,\"rtoCount\":150,\"rtoPercent\":15,\"totalLostFreightDollars\":13500,\"status\":\"RTO_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars of freight shipping cash are lost when 150 COD orders fail delivery with $50 forward shipping and $40 return shipping ($150 \\times (50 + 40)$)?",
          "expectedStringOutput": "13500",
          "acceptableAnswers": [
            "13500",
            "$13,500",
            "13,500",
            "totalLostFreightDollars\":13500"
          ],
          "primaryMisconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
          "diagnosisMap": {
            "7500": {
              "misconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
              "errorExplanation": "7,500 calculates forward shipping only (150 * 50). RTO packages incur return shipping too: 150 * (50 + 40) = $13,500.",
              "recoveryPath": {
                "simplerExplanation": "150 * 90 = 13,500.",
                "guidedFixPrompt": "Type 13500"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d10-b2-otp-pre-dispatch-verification",
        "day": 10,
        "blockNumber": 2,
        "title": "Automated WhatsApp OTP Pre-Dispatch Address Verification",
        "conceptBudget": {
          "primaryConcept": "Pre-Dispatch Verification Invariant",
          "supportingTerms": [
            "Automated WhatsApp message sends OTP to confirm COD intent",
            "Cancelling unconfirmed or fake COD orders before dispatch saves 100% of forward and reverse shipping costs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d10-b1-cod-rto-freight-loss-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pre-Dispatch Verification Pipeline",
            "codeSnippet": "// 1. COD Order Placed -> Automated WhatsApp sends 'Confirm Order with PIN 4819'\n// 2. Customer Confirms PIN -> OMS marks order 'VERIFIED_READY_TO_DISPATCH'\n// 3. Customer Ignores/Declines -> OMS auto-cancels -> $0 freight lost!",
            "lineNotes": {
              "1": "Verification trigger.",
              "2": "Verified dispatch.",
              "3": "Zero freight waste."
            }
          },
          {
            "type": "runnable_code",
            "filename": "otp_verify_demo.js",
            "initialCode": "function evaluateCodOrderDispatch(isOtpConfirmed) {\n  return isOtpConfirmed\n    ? 'VERIFIED_DISPATCH_LOW_RTO_RISK'\n    : 'CANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS';\n}\n\nconsole.log(evaluateCodOrderDispatch(true));\nconsole.log(evaluateCodOrderDispatch(false));",
            "expectedOutput": "VERIFIED_DISPATCH_LOW_RTO_RISK\nCANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective action is executed on an unconfirmed high-risk COD order that fails pre-dispatch phone verification?",
          "expectedStringOutput": "CANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS",
          "acceptableAnswers": [
            "CANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS",
            "Cancel Order",
            "Prevent freight loss"
          ],
          "primaryMisconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
          "diagnosisMap": {
            "DISPATCH": {
              "misconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
              "errorExplanation": "Dispatching unconfirmed COD orders guarantees high RTO loss. Unconfirmed orders should be cancelled.",
              "recoveryPath": {
                "simplerExplanation": "Matches CANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS.",
                "guidedFixPrompt": "Type CANCEL_ORDER_PREVENT_100_PERCENT_FREIGHT_LOSS"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d10-b3-carrier-selection-algorithms",
        "day": 10,
        "blockNumber": 3,
        "title": "Dynamic Carrier Routing: Lowest Cost vs Guaranteed SLA",
        "conceptBudget": {
          "primaryConcept": "Dynamic 3PL Carrier Selection",
          "supportingTerms": [
            "Courier Aggregator API (Bluedart, Delhivery, FedEx, DHL, Shadowfax)",
            "Dynamic Repricing: Pin-code serviceability + lowest rate per volumetric kg matching"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d10-b2-otp-pre-dispatch-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "carrier_routing_demo.js",
            "initialCode": "function selectOptimalCarrier(carriers) {\n  return carriers.sort((a, b) => a.rate - b.rate)[0].name;\n}\n\nconsole.log(selectOptimalCarrier([\n  { name: 'CARRIER_EXPRESS_AIR', rate: 75 },\n  { name: 'CARRIER_SURFACE_SURCHARGE', rate: 45 },\n  { name: 'CARRIER_PRIORITY_PLUS', rate: 90 }\n]));",
            "expectedOutput": "CARRIER_SURFACE_SURCHARGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which carrier is selected by the dynamic routing algorithm when prioritizing the lowest shipping rate per kilogram?",
          "expectedStringOutput": "CARRIER_SURFACE_SURCHARGE",
          "acceptableAnswers": [
            "CARRIER_SURFACE_SURCHARGE",
            "Surface Surcharge",
            "Lowest rate carrier"
          ],
          "primaryMisconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
          "diagnosisMap": {
            "AIR": {
              "misconceptionId": "MC_ECOM_LOGISTICS_3PL_COD_RTO_MITIGATION",
              "errorExplanation": "Air carrier rate is 75. The lowest rate carrier is CARRIER_SURFACE_SURCHARGE at 45.",
              "recoveryPath": {
                "simplerExplanation": "Matches CARRIER_SURFACE_SURCHARGE.",
                "guidedFixPrompt": "Type CARRIER_SURFACE_SURCHARGE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Reverse Logistics & Returns Management: RMA & Restocking Inspection",
    "overviewMetaphor": "Reverse Logistics Quality Inspection is a Jewelry Appraiser Inspecting Returned Goods: When a customer returns a $200.00 item under an authorized Return Merchandise Authorization (RMA), the warehouse inspects its physical condition: Grade A (Pristine with tags: Restocked at 100% full value = $200.00); Grade B (Opened box, perfect item: Sold in 'Open Box' section at 75% value = $150.00); Grade C (Damaged packaging: Liquidated at 30% value = $60.00); automated grading protects store cash flow.",
    "blocks": [
      {
        "id": "ecom-d11-b1-rma-quality-grading-recovery",
        "day": 11,
        "blockNumber": 1,
        "title": "RMA Warehouse Quality Grading: Grade A (100%), Grade B (75%) & Grade C (30%)",
        "conceptBudget": {
          "primaryConcept": "RMA Restocking Recovery Formula",
          "supportingTerms": [
            "Return Merchandise Authorization (RMA)",
            "Grade A Pristine (100% Value Recovery e.g. $200.00)",
            "Grade B Open-Box (75% Value Recovery e.g. $150.00)",
            "Grade C Secondary Liquidation (30% Value Recovery e.g. $60.00)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d10-b1-cod-rto-freight-loss-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Reverse Logistics Disposition Matrix ($200 Original Value)",
              "boxes": [
                {
                  "label": "Grade A (Pristine Tags)",
                  "value": "100% Recovery -> $200.00 (Restocked as Brand New)",
                  "varType": "Grade A",
                  "isUpdated": false
                },
                {
                  "label": "Grade B (Open Box)",
                  "value": "75% Recovery -> $150.00 (Resold in Open-Box Outlet)",
                  "varType": "Grade B",
                  "isUpdated": false
                },
                {
                  "label": "Grade C (Damaged Box)",
                  "value": "30% Recovery -> $60.00 (Liquidated to bulk wholesaler)",
                  "varType": "Grade C",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rma_grading_calc_demo.js",
            "initialCode": "function calculateRmaRecovery(grade, retailValue) {\n  let mult = 0;\n  if (grade === 'GRADE_A_PRISTINE') mult = 1.0;\n  else if (grade === 'GRADE_B_OPEN_BOX') mult = 0.75;\n  else mult = 0.30;\n  const recovered = retailValue * mult;\n  return {\n    grade,\n    retailValue,\n    recoveredValue: recovered,\n    status: 'RMA_RECOVERED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRmaRecovery('GRADE_B_OPEN_BOX', 200)));",
            "expectedOutput": "{\"grade\":\"GRADE_B_OPEN_BOX\",\"retailValue\":200,\"recoveredValue\":150,\"status\":\"RMA_RECOVERED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars of inventory value are recovered when an open-box Grade B returned item with a $200 original retail price is inspected and dispositioned for outlet resale ($200 \\times 0.75$)?",
          "expectedStringOutput": "150",
          "acceptableAnswers": [
            "150",
            "$150",
            "150.0",
            "recoveredValue\":150"
          ],
          "primaryMisconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
              "errorExplanation": "200 applies to Grade A pristine items. Grade B open-box items recover 75% = $150.",
              "recoveryPath": {
                "simplerExplanation": "200 * 0.75 = 150.",
                "guidedFixPrompt": "Type 150"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d11-b2-self-service-returns-portal",
        "day": 11,
        "blockNumber": 2,
        "title": "Automated Self-Service Customer Returns Portal & Prepaid Labels",
        "conceptBudget": {
          "primaryConcept": "Self-Service Returns Architecture",
          "supportingTerms": [
            "Customer enters Order # and ZIP Code $\\to$ Selects return reason $\\to$ Downloads instant prepaid courier return label",
            "Reduces support ticket volume by 65%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d11-b1-rma-quality-grading-recovery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Returns Portal Workflow",
            "codeSnippet": "// Customer Enters Return Reason: 'Wrong Size (M -> Need L)'\n// -> Portal Offers: 'Instant Exchange with 10% Bonus Credit' (Saves the sale!)\n// -> If Refund Requested: System issues prepaid return label automatically",
            "lineNotes": {
              "1": "Return reason capture.",
              "2": "Exchange retention incentive.",
              "3": "Automated label generation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "returns_portal_demo.js",
            "initialCode": "function evaluateExchangeIncentive(acceptsExchangeCredit) {\n  return acceptsExchangeCredit\n    ? 'RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE'\n    : 'ISSUE_PREPAID_RETURN_LABEL_FOR_REFUND';\n}\n\nconsole.log(evaluateExchangeIncentive(true));\nconsole.log(evaluateExchangeIncentive(false));",
            "expectedOutput": "RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE\nISSUE_PREPAID_RETURN_LABEL_FOR_REFUND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What profitable e-commerce outcome is achieved when a customer returning an item accepts an instant exchange with bonus store credit instead of requesting a cash refund?",
          "expectedStringOutput": "RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE",
          "acceptableAnswers": [
            "RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE",
            "Retain Revenue",
            "Instant Exchange"
          ],
          "primaryMisconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
          "diagnosisMap": {
            "REFUND": {
              "misconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
              "errorExplanation": "Exchanges preserve gross revenue. It achieves RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE.",
              "recoveryPath": {
                "simplerExplanation": "Matches RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE.",
                "guidedFixPrompt": "Type RETAIN_CUSTOMER_REVENUE_VIA_INSTANT_EXCHANGE"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d11-b3-reverse-logistics-cost-absorption",
        "day": 11,
        "blockNumber": 3,
        "title": "Reverse Logistics Cost Absorption: Restocking Fees vs Free Returns",
        "conceptBudget": {
          "primaryConcept": "Return Shipping Fee Strategy",
          "supportingTerms": [
            "High-Margin Apparel (Free returns to maximize conversion)",
            "Low-Margin Bulk Electronics (Charging $15 return shipping fee to prevent buyer remorse abuse)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d11-b2-self-service-returns-portal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "return_fee_demo.js",
            "initialCode": "function getReturnPolicyStrategy(grossMarginPct) {\n  return grossMarginPct >= 65.0\n    ? 'FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION'\n    : 'DEDUCT_RETURN_SHIPPING_FEE_FROM_REFUND';\n}\n\nconsole.log(getReturnPolicyStrategy(75.0));\nconsole.log(getReturnPolicyStrategy(30.0));",
            "expectedOutput": "FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION\nDEDUCT_RETURN_SHIPPING_FEE_FROM_REFUND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which return policy strategy is optimal for a high-margin (75% gross margin) D2C fashion apparel brand?",
          "expectedStringOutput": "FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION",
          "acceptableAnswers": [
            "FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION",
            "Free Returns",
            "Free returns to maximize conversion"
          ],
          "primaryMisconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
          "diagnosisMap": {
            "RESTOCK_FEE": {
              "misconceptionId": "MC_ECOM_REVERSE_LOGISTICS_RMA_RESTOCKING",
              "errorExplanation": "High margin apparel thrives on free returns to eliminate customer hesitation.",
              "recoveryPath": {
                "simplerExplanation": "Matches FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION.",
                "guidedFixPrompt": "Type FREE_RETURNS_TO_MAXIMIZE_CHECKOUT_CONVERSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Marketplace Operations (Amazon / Flipkart / ONDC): The Buy Box Algorithm",
    "overviewMetaphor": "The Amazon Buy Box is the Gold Winner's Podium in an Olympic Sprint: 85% of all Amazon purchases occur through the 1-Click 'Add to Cart' Buy Box button; multiple merchants may sell the exact same brand SKU, but the Buy Box Algorithm awards the button to the seller with the winning combination: Landed Price ($25.00), Amazon Prime FBA fulfillment (+30 pts), Seller Rating (98% = +24.5 pts), and an Order Defect Rate under 1.0% (+10 pts), achieving an elite 94.5 Buy Box Score.",
    "blocks": [
      {
        "id": "ecom-d12-b1-amazon-buy-box-winning-score",
        "day": 12,
        "blockNumber": 1,
        "title": "Amazon Buy Box Algorithm: Price, Prime FBA, Rating & Order Defect Rate (ODR < 1%)",
        "conceptBudget": {
          "primaryConcept": "Buy Box Winning Score Formula",
          "supportingTerms": [
            "Price Component: $(100 - \\text{Price}) \\times 0.40 = (100 - 25) \\times 0.40 = 30.0$ pts",
            "FBA Prime Fulfillment: $+30.0$ bonus pts",
            "Seller Rating: $98\\% \\times 0.25 = 24.5$ pts",
            "ODR Compliance ($ODR \\le 1.0\\%$): $+10.0$ pts",
            "Total Buy Box Score = $30 + 30 + 24.5 + 10 = 94.5$ pts (WINNER!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d11-b1-rma-quality-grading-recovery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Amazon Buy Box Algorithm Scorecard ($25 Landed Price, FBA Prime, 98% Rating)",
              "boxes": [
                {
                  "label": "Competitive Landed Price",
                  "value": "$25.00 Landed Price -> 30.00 Points",
                  "varType": "Price Points",
                  "isUpdated": false
                },
                {
                  "label": "Prime FBA Fulfillment",
                  "value": "Fulfilled by Amazon (FBA) 1-Day Prime -> +30.00 Points",
                  "varType": "FBA Points",
                  "isUpdated": false
                },
                {
                  "label": "Total Buy Box Score",
                  "value": "30.0 + 30.0 + 24.5 + 10.0 = 94.50 (WINS BUY BOX #1 SPOT!)",
                  "varType": "Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "buy_box_calc_demo.js",
            "initialCode": "function calculateBuyBox(price, isFba, ratingPct, odrPct) {\n  let score = (100 - price) * 0.40;\n  if (isFba) score += 30.0;\n  score += (ratingPct * 0.25);\n  if (odrPct <= 1.0) score += 10.0;\n  return {\n    price,\n    isFba,\n    buyBoxScore: Number(score.toFixed(1)),\n    isWinner: score >= 75.0 && odrPct < 1.0,\n    status: 'BUY_BOX_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBuyBox(25, true, 98, 0.2)));",
            "expectedOutput": "{\"price\":25,\"isFba\":true,\"buyBoxScore\":94.5,\"isWinner\":true,\"status\":\"BUY_BOX_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total Buy Box Score for an Amazon seller offering a $25 landed price, FBA Prime fulfillment, 98% seller rating, and 0.2% ODR ($ 30 + 30 + 24.5 + 10 $)?",
          "expectedStringOutput": "94.5",
          "acceptableAnswers": [
            "94.5",
            "94.5 pts",
            "buyBoxScore\":94.5"
          ],
          "primaryMisconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
          "diagnosisMap": {
            "64.5": {
              "misconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
              "errorExplanation": "64.5 forgets the +30 FBA Prime bonus. Total score is 30 + 30 + 24.5 + 10 = 94.5.",
              "recoveryPath": {
                "simplerExplanation": "30 + 30 + 24.5 + 10 = 94.5.",
                "guidedFixPrompt": "Type 94.5"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d12-b2-fba-vs-fbm-logistics-models",
        "day": 12,
        "blockNumber": 2,
        "title": "Amazon FBA (Fulfillment by Amazon) vs FBM (Merchant Fulfilled)",
        "conceptBudget": {
          "primaryConcept": "FBA vs FBM Fulfillment Dynamics",
          "supportingTerms": [
            "FBA (Amazon warehouses, picks, packs, ships, and handles customer service: Prime badge unlocked)",
            "FBM (Merchant stores and ships from own warehouse: Lower storage fees, but 70% lower Buy Box win rate)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d12-b1-amazon-buy-box-winning-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FBA vs FBM Decision Rule",
            "codeSnippet": "// FAST-MOVING SMALL ITEMS: Amazon FBA (Prime badge + automatic Buy Box win!)\n// BULK HEAVY FURNITURE:    Amazon FBM (Avoids extreme Amazon warehouse oversize storage fees)",
            "lineNotes": {
              "1": "High velocity retail.",
              "2": "Oversize logistics."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fba_decision_demo.js",
            "initialCode": "function selectMarketplaceFulfillment(isOversizeBulky) {\n  return isOversizeBulky\n    ? 'FULFILLED_BY_MERCHANT_FBM'\n    : 'FULFILLED_BY_AMAZON_FBA';\n}\n\nconsole.log(selectMarketplaceFulfillment(false));\nconsole.log(selectMarketplaceFulfillment(true));",
            "expectedOutput": "FULFILLED_BY_AMAZON_FBA\nFULFILLED_BY_MERCHANT_FBM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which fulfillment method is chosen for standard lightweight consumer electronics to automatically qualify for the Amazon Prime delivery badge?",
          "expectedStringOutput": "FULFILLED_BY_AMAZON_FBA",
          "acceptableAnswers": [
            "FULFILLED_BY_AMAZON_FBA",
            "FBA",
            "Fulfilled by Amazon"
          ],
          "primaryMisconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
          "diagnosisMap": {
            "FBM": {
              "misconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
              "errorExplanation": "FBM does not qualify for Prime by default. Amazon FBA unlocks the Prime badge.",
              "recoveryPath": {
                "simplerExplanation": "Matches FULFILLED_BY_AMAZON_FBA.",
                "guidedFixPrompt": "Type FULFILLED_BY_AMAZON_FBA"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d12-b3-ondc-open-protocol-commerce",
        "day": 12,
        "blockNumber": 3,
        "title": "ONDC (Open Network for Digital Commerce): Unbundling Platform Monopolies",
        "conceptBudget": {
          "primaryConcept": "ONDC Protocol Architecture",
          "supportingTerms": [
            "ONDC (Open Network for Digital Commerce: Open Beckn protocol)",
            "Unbundles Buyer Apps (Paytm, PhonePe) from Seller Apps (Mystore) and 3PL Delivery Apps (Dunzo, Shadowfax)",
            "Eliminates 30% marketplace commission gatekeeping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d12-b2-fba-vs-fbm-logistics-models",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ondc_demo.js",
            "initialCode": "function getOndcCoreAdvantage() {\n  return 'OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL';\n}\n\nconsole.log(getOndcCoreAdvantage());",
            "expectedOutput": "OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core architectural principle defines India's Open Network for Digital Commerce (ONDC)?",
          "expectedStringOutput": "OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL",
          "acceptableAnswers": [
            "OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL",
            "Open Protocol",
            "Unbundled Commerce"
          ],
          "primaryMisconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
          "diagnosisMap": {
            "CLOSED": {
              "misconceptionId": "MC_ECOM_MARKETPLACE_AMAZON_BUY_BOX_ONDC",
              "errorExplanation": "Amazon is a closed proprietary walled garden. ONDC is an open unbundled protocol.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL.",
                "guidedFixPrompt": "Type OPEN_UNBUNDLED_INTEROPERABLE_COMMERCE_PROTOCOL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "D2C Tech Stacks: Headless Commerce vs Monolith Architectures",
    "overviewMetaphor": "Headless Commerce is Decoupling the High-Performance Steering Wheel from the Electric Engine: In a traditional monolithic platform (Shopify Liquid, WooCommerce PHP), the frontend presentation template is tightly glued to the backend database, resulting in a sluggish 350ms Time to First Byte (TTFB); in Headless Commerce, a lightning-fast React/Next.js frontend connects via GraphQL APIs to a headless commerce engine, achieving an ultra-fast 45ms TTFB and giving developers total UI freedom.",
    "blocks": [
      {
        "id": "ecom-d13-b1-headless-vs-monolith-performance",
        "day": 13,
        "blockNumber": 1,
        "title": "Headless Commerce Performance: 45ms TTFB vs 350ms Monolith Latency",
        "conceptBudget": {
          "primaryConcept": "Headless Commerce Architecture",
          "supportingTerms": [
            "Time to First Byte (TTFB: 45ms Headless vs 350ms Monolith)",
            "Frontend Presentation Layer (React, Next.js, Vercel Edge CDN)",
            "Backend Commerce Engine (Shopify Storefront API, Commercelayer, BigCommerce API)",
            "Decoupled via REST & GraphQL APIs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d12-b1-amazon-buy-box-winning-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Commerce Architecture Benchmark",
              "boxes": [
                {
                  "label": "Traditional Monolith (PHP/Liquid)",
                  "value": "350ms TTFB Server Rendering Latency (Constrained themes)",
                  "varType": "Monolith",
                  "isUpdated": false
                },
                {
                  "label": "Headless Next.js + Edge CDN",
                  "value": "45ms TTFB Static Edge Generation (UNLIMITED CUSTOM UI & SPEED!)",
                  "varType": "Headless",
                  "isUpdated": true
                },
                {
                  "label": "Conversion Rate Impact",
                  "value": "Every 100ms speed improvement boosts e-commerce conversion by +1.1%!",
                  "varType": "Speed Impact",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "headless_calc_demo.js",
            "initialCode": "function evaluateArchitecture(isHeadless) {\n  return {\n    architecture: isHeadless ? 'HEADLESS_JAMSTACK_MICROSERVICES' : 'MONOLITHIC',\n    ttfbMs: isHeadless ? 45 : 350,\n    status: 'ARCHITECTURE_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateArchitecture(true)));\nconsole.log(JSON.stringify(evaluateArchitecture(false)));",
            "expectedOutput": "{\"architecture\":\"HEADLESS_JAMSTACK_MICROSERVICES\",\"ttfbMs\":45,\"status\":\"ARCHITECTURE_EVALUATED\"}\n{\"architecture\":\"MONOLITHIC\",\"ttfbMs\":350,\"status\":\"ARCHITECTURE_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Time to First Byte (TTFB) latency in milliseconds delivered by a Next.js edge-cached Headless Commerce architecture?",
          "expectedStringOutput": "45",
          "acceptableAnswers": [
            "45",
            "45ms",
            "45 milliseconds",
            "ttfbMs\":45"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
          "diagnosisMap": {
            "350": {
              "misconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
              "errorExplanation": "350ms is the latency of legacy monolithic servers. Headless edge caching delivers 45ms TTFB.",
              "recoveryPath": {
                "simplerExplanation": "Headless TTFB is 45ms.",
                "guidedFixPrompt": "Type 45"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d13-b2-mach-architecture-microservices",
        "day": 13,
        "blockNumber": 2,
        "title": "MACH Architecture: Microservices, API-First, Cloud-Native & Headless",
        "conceptBudget": {
          "primaryConcept": "MACH Architectural Principles",
          "supportingTerms": [
            "M (Microservices: Independent deployment)",
            "A (API-first: Universal connectivity)",
            "C (Cloud-native: Elastic serverless scale)",
            "H (Headless: Front-end decoupling)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d13-b1-headless-vs-monolith-performance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MACH 4 Pillars",
            "codeSnippet": "// M: Microservices (Catalog, Cart, Payment run as separate microservices)\n// A: API-First (Every feature exposed via GraphQL / REST APIs)\n// C: Cloud-Native (Serverless elastic auto-scaling during Black Friday)\n// H: Headless (Front-end independent from backend logic)",
            "lineNotes": {
              "1": "Modular services.",
              "2": "API contract.",
              "3": "Serverless scale.",
              "4": "UI independence."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mach_demo.js",
            "initialCode": "function getMachPillars() {\n  return ['MICROSERVICES', 'API_FIRST', 'CLOUD_NATIVE', 'HEADLESS'];\n}\n\nconsole.log(JSON.stringify(getMachPillars()));",
            "expectedOutput": "[\"MICROSERVICES\",\"API_FIRST\",\"CLOUD_NATIVE\",\"HEADLESS\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'A' represent in the enterprise MACH e-commerce architectural acronym?",
          "expectedStringOutput": "API_FIRST",
          "acceptableAnswers": [
            "API_FIRST",
            "API-First",
            "API First"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
          "diagnosisMap": {
            "ASYNC": {
              "misconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
              "errorExplanation": "In MACH architecture, 'A' stands for API-First design.",
              "recoveryPath": {
                "simplerExplanation": "Matches API_FIRST.",
                "guidedFixPrompt": "Type API_FIRST"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d13-b3-cdn-edge-caching-static-generation",
        "day": 13,
        "blockNumber": 3,
        "title": "Incremental Static Regeneration (ISR) & Edge Caching",
        "conceptBudget": {
          "primaryConcept": "ISR & Edge CDN Caching",
          "supportingTerms": [
            "Next.js ISR (Pre-rendering 100,000 product pages statically to CDN edge)",
            "Background revalidation when inventory or price changes in ERP"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d13-b2-mach-architecture-microservices",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "isr_demo.js",
            "initialCode": "function getEdgeRenderingStrategy() {\n  return 'INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN';\n}\n\nconsole.log(getEdgeRenderingStrategy());",
            "expectedOutput": "INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What rendering strategy pre-generates static e-commerce product pages to global CDN edge nodes while dynamically revalidating pricing updates in the background?",
          "expectedStringOutput": "INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN",
          "acceptableAnswers": [
            "INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN",
            "ISR",
            "Incremental Static Regeneration"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
          "diagnosisMap": {
            "SSR": {
              "misconceptionId": "MC_ECOM_D2C_HEADLESS_COMMERCE_TECH_STACK",
              "errorExplanation": "Pure SSR renders on every request causing server strain. Next.js ISR pre-generates static pages at the edge.",
              "recoveryPath": {
                "simplerExplanation": "Matches INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN.",
                "guidedFixPrompt": "Type INCREMENTAL_STATIC_REGENERATION_AT_EDGE_CDN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Customer Support & Post-Purchase Experience: First Response Time (FRT) & SLA",
    "overviewMetaphor": "Customer Support is a Fire Department with an 8-Minute Emergency Guarantee: When an anxious customer messages asking 'Where is my package?', achieving an 8-minute First Response Time (FRT $\\le 15$ minutes) and resolving the delivery issue within 12 hours produces a 94.5% CSAT (Customer Satisfaction) score; fast, empathetic post-purchase support converts 60% of upset buyers into lifelong brand advocates.",
    "blocks": [
      {
        "id": "ecom-d14-b1-support-sla-first-response-time",
        "day": 14,
        "blockNumber": 1,
        "title": "Customer Support Tier-1 SLAs: FRT $\\le 15$ min, CSAT $\\ge 90\\%$ & Resolution $\\le 24$h",
        "conceptBudget": {
          "primaryConcept": "Support SLA Benchmarks",
          "supportingTerms": [
            "First Response Time ($FRT \\le 15$ minutes)",
            "Customer Satisfaction ($CSAT \\ge 90.0\\%$)",
            "First Contact Resolution (FCR $\\ge 75.0\\%$)",
            "Full Resolution SLA ($\\le 24.0$ hours)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d13-b1-headless-vs-monolith-performance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Support Operations Scorecard (FRT = 8 min, CSAT = 94.5%, Resolution = 12h)",
              "boxes": [
                {
                  "label": "1. First Response Time (FRT)",
                  "value": "8 Minutes <= 15 Min SLA Threshold -> PASS (Fast immediate response)",
                  "varType": "FRT",
                  "isUpdated": false
                },
                {
                  "label": "2. Customer Satisfaction (CSAT)",
                  "value": "94.5% CSAT >= 90.0% Standard -> PASS (High user delight)",
                  "varType": "CSAT",
                  "isUpdated": false
                },
                {
                  "label": "3. Tier-1 Support Rating",
                  "value": "TIER_1_EXEMPLARY_CUSTOMER_SUPPORT (100% SLA PASS!)",
                  "varType": "Rating",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "support_audit_demo.js",
            "initialCode": "function auditSupport(frtMin, csatPct, resHours) {\n  const ok = frtMin <= 15 && csatPct >= 90.0 && resHours <= 24;\n  return {\n    frtMinutes: frtMin,\n    csatPercent: csatPct,\n    resolutionHours: resHours,\n    isTier1: ok,\n    status: ok ? 'TIER_1_EXEMPLARY_CUSTOMER_SUPPORT' : 'SLA_BREACH'\n  };\n}\n\nconsole.log(JSON.stringify(auditSupport(8, 94.5, 12)));\nconsole.log(JSON.stringify(auditSupport(45, 82.0, 48)));",
            "expectedOutput": "{\"frtMinutes\":8,\"csatPercent\":94.5,\"resolutionHours\":12,\"isTier1\":true,\"status\":\"TIER_1_EXEMPLARY_CUSTOMER_SUPPORT\"}\n{\"frtMinutes\":45,\"csatPercent\":82,\"resolutionHours\":48,\"isTier1\":false,\"status\":\"SLA_BREACH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum allowable First Response Time (FRT) in minutes to qualify for Tier-1 e-commerce customer support standards?",
          "expectedStringOutput": "15",
          "acceptableAnswers": [
            "15",
            "15 min",
            "15 minutes",
            "frtMinutes\":8"
          ],
          "primaryMisconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
              "errorExplanation": "60 minutes is too slow for modern live chat. Tier-1 standard requires FRT <= 15 minutes.",
              "recoveryPath": {
                "simplerExplanation": "FRT benchmark is 15 minutes.",
                "guidedFixPrompt": "Type 15"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d14-b2-ai-support-ticket-deflection",
        "day": 14,
        "blockNumber": 2,
        "title": "AI Chatbot Ticket Deflection (WISMO: Where Is My Order?)",
        "conceptBudget": {
          "primaryConcept": "AI Ticket Deflection",
          "supportingTerms": [
            "WISMO queries represent 60% of e-commerce support volume",
            "AI Chatbots connect to courier APIs to resolve WISMO instantly, deflecting 70% of tickets from human agents"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d14-b1-support-sla-first-response-time",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WISMO Chatbot Automation",
            "codeSnippet": "// User: 'Where is my order #9876?'\n// -> AI Bot calls OMS & Courier API: 'Your package is on delivery truck #4, arriving today by 3 PM!'\n// -> Result: Instant 0-second answer + 0 human agent cost!",
            "lineNotes": {
              "1": "WISMO inquiry.",
              "2": "API live lookup.",
              "3": "Zero touch resolution."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wismo_demo.js",
            "initialCode": "function evaluateTicketDeflection(isWismoQuery) {\n  return isWismoQuery\n    ? 'AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION'\n    : 'ROUTE_TO_HUMAN_SPECIALIST';\n}\n\nconsole.log(evaluateTicketDeflection(true));\nconsole.log(evaluateTicketDeflection(false));",
            "expectedOutput": "AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION\nROUTE_TO_HUMAN_SPECIALIST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are standard 'Where Is My Order?' (WISMO) customer inquiries handled in high-efficiency autonomous e-commerce support systems?",
          "expectedStringOutput": "AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION",
          "acceptableAnswers": [
            "AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION",
            "AI Deflection",
            "Automated Tracking"
          ],
          "primaryMisconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
          "diagnosisMap": {
            "HUMAN": {
              "misconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
              "errorExplanation": "Routing simple WISMO inquiries to humans wastes staff time. AI bots deflect them automatically.",
              "recoveryPath": {
                "simplerExplanation": "Matches AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION.",
                "guidedFixPrompt": "Type AI_INSTANT_API_DISPATCH_TRACKING_DEFLECTION"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d14-b3-proactive-delivery-exception-alerts",
        "day": 14,
        "blockNumber": 3,
        "title": "Proactive Delivery Exception Handling: Reversing Bad Reviews Before They Happen",
        "conceptBudget": {
          "primaryConcept": "Proactive Exception Handling",
          "supportingTerms": [
            "Courier delayed by weather/flood",
            "System detects delay and emails customer with $10 apology voucher BEFORE customer notices delay",
            "Reduces 1-star reviews by 80%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d14-b2-ai-support-ticket-deflection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "proactive_alert_demo.js",
            "initialCode": "function handleCourierDelay(isDelayed) {\n  return isDelayed\n    ? 'PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY'\n    : 'MAINTAIN_STANDARD_TRACKING';\n}\n\nconsole.log(handleCourierDelay(true));",
            "expectedOutput": "PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What proactive customer success workflow is executed when a logistics carrier logs an unavoidable transit weather delay?",
          "expectedStringOutput": "PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY",
          "acceptableAnswers": [
            "PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY",
            "Proactive notification",
            "Apology voucher"
          ],
          "primaryMisconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
          "diagnosisMap": {
            "WAIT": {
              "misconceptionId": "MC_ECOM_CUSTOMER_SERVICE_FRT_SLA_POST_PURCHASE",
              "errorExplanation": "Waiting for the customer to complain causes 1-star reviews. Proactively notifying them preserves trust.",
              "recoveryPath": {
                "simplerExplanation": "Matches PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY.",
                "guidedFixPrompt": "Type PROACTIVELY_NOTIFY_CUSTOMER_AND_ISSUE_STORE_CREDIT_APOLOGY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign supply chain, OMS lifecycle, and marketplace operations suite: 1. Payment gateway settlement reconciliation ($979.70 net from $1,000 order); 2. OMS 6-stage lifecycle state transition validation; 3. Reorder Point inventory calculation ($ROP = 650$ units); 4. Carrier volumetric weight auditing ($12.0$ kg); 5. Amazon Buy Box winning score evaluation ($94.5$ pts).",
    "blocks": [
      {
        "id": "ecom-d15-b1-operations-master-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "E-Commerce Operations & Supply Chain Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Operations Master Engine Synthesis",
          "supportingTerms": [
            "Settlement Engine",
            "OMS FSM Engine",
            "ROP Inventory Engine",
            "Volumetric Freight Auditor",
            "Buy Box Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d14-b3-proactive-delivery-exception-alerts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Operations & Supply Chain Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Validates payment settlement ($979.70 net bank remittance)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Executes OMS 6-stage order lifecycle state machine",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes ROP (650 units) and 12.0 kg volumetric freight weight",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Scores 94.5 Buy Box rating and certifies operations engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "operations_master_kernel_demo.js",
            "initialCode": "function runEcommerceOperationsEngine() {\n  return {\n    settlementSubsystem: 'ONLINE_PAYMENT_SETTLEMENT_ACTIVE',\n    omsSubsystem: 'ONLINE_OMS_FSM_ACTIVE',\n    ropSubsystem: 'ONLINE_ROP_INVENTORY_ACTIVE',\n    freightSubsystem: 'ONLINE_VOLUMETRIC_ACTIVE',\n    buyBoxSubsystem: 'ONLINE_BUY_BOX_SCORER_ACTIVE',\n    engineStatus: 'ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runEcommerceOperationsEngine().engineStatus);",
            "expectedOutput": "ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the E-Commerce Operations & Supply Chain Master Engine?",
          "expectedStringOutput": "ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE",
          "acceptableAnswers": [
            "ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE",
            "engineStatus: ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "Matches ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ECOMMERCE_OPERATIONS_AND_SUPPLY_CHAIN_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d15-b2-operations-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Operations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Operations Invariant Verification",
          "supportingTerms": [
            "Payment Invariant",
            "OMS Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d15-b1-operations-master-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "operations_audit_demo.js",
            "initialCode": "function auditOperationsEngine(payValid, omsValid, ropValid, bbValid) {\n  const passed = payValid && omsValid && ropValid && bbValid;\n  return {\n    paymentVerified: payValid,\n    omsVerified: omsValid,\n    ropVerified: ropValid,\n    buyBoxVerified: bbValid,\n    grade: passed ? 'OPERATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditOperationsEngine(true, true, true, true)));",
            "expectedOutput": "{\"paymentVerified\":true,\"omsVerified\":true,\"ropVerified\":true,\"buyBoxVerified\":true,\"grade\":\"OPERATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Payment, OMS, ROP, and Buy Box engines pass 100%?",
          "expectedStringOutput": "OPERATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "OPERATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"OPERATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "All checks passing awards OPERATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards OPERATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type OPERATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d15-b3-milestone2-ecom-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 E-Commerce Operations & Supply Chain Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Operations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d15-b2-operations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_ecom_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_ORDER_MANAGEMENT_STATE_MACHINE_OMS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Supply Chain, OMS, Logistics & Marketplace Operations Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "E-Commerce Unit Economics: Gross Merchandise Value (GMV) to Contribution Margin (CM3)",
    "overviewMetaphor": "The E-Commerce P&L is a Cascading Waterfall of Deductions: Gross Merchandise Value ($GMV = \\$100,000$) minus Returns & Cancellations ($10,000$) yields Net Sales ($90,000$); deducting COGS ($30,000$) leaves Contribution Margin 1 ($CM1 = \\$60,000$); deducting logistics freight and payment gateway fees ($15,000$) leaves Contribution Margin 2 ($CM2 = \\$45,000$); finally deducting paid advertising ad CAC ($25,000$) leaves Contribution Margin 3 ($CM3 = \\$20,000$, a healthy 22.22% CM3 margin), proving the business makes real cash profit on every order.",
    "blocks": [
      {
        "id": "ecom-d16-b1-contribution-margin-waterfall",
        "day": 16,
        "blockNumber": 1,
        "title": "The E-Commerce Contribution Margin (CM1, CM2, CM3) Waterfall",
        "conceptBudget": {
          "primaryConcept": "Contribution Margin Waterfall Formula",
          "supportingTerms": [
            "Gross Merchandise Value ($GMV = \\$100,000$)",
            "Net Sales = $GMV - \\text{Returns} = \\$90,000$",
            "Contribution Margin 1: $\\text{Net} - \\text{COGS} = \\$60,000$ (Product margin)",
            "Contribution Margin 2: $CM1 - \\text{Logistics/PG} = \\$45,000$ (Operational margin)",
            "Contribution Margin 3: $CM2 - \\text{Paid Ad CAC} = \\$20,000$ ($22.22\\%$ CM3 Margin)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d15-b1-operations-master-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "E-Commerce P&L Waterfall ($100k GMV)",
              "boxes": [
                {
                  "label": "Net Sales (After Returns)",
                  "value": "$100,000 GMV - $10,000 Returns = $90,000.00 Net Sales",
                  "varType": "Net Sales",
                  "isUpdated": false
                },
                {
                  "label": "CM1 & CM2 Margins",
                  "value": "CM1: $60k (After $30k COGS) -> CM2: $45k (After $15k Shipping/PG)",
                  "varType": "CM1 & CM2",
                  "isUpdated": false
                },
                {
                  "label": "CM3 Final Net Profit",
                  "value": "$45,000 - $25,000 Paid CAC = $20,000.00 (22.22% CM3 PROFIT!)",
                  "varType": "CM3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cm_waterfall_calc_demo.js",
            "initialCode": "function calculateCmWaterfall(gmv, returns, cogs, logistics, cac) {\n  const netSales = gmv - returns;\n  const cm1 = netSales - cogs;\n  const cm2 = cm1 - logistics;\n  const cm3 = cm2 - cac;\n  const cm3Pct = (cm3 / netSales) * 100;\n  return {\n    netSales,\n    cm1,\n    cm2,\n    cm3,\n    cm3Percent: Number(cm3Pct.toFixed(2)),\n    status: 'WATERFALL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCmWaterfall(100000, 10000, 30000, 15000, 25000)));",
            "expectedOutput": "{\"netSales\":90000,\"cm1\":60000,\"cm2\":45000,\"cm3\":20000,\"cm3Percent\":22.22,\"status\":\"WATERFALL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Contribution Margin 3 (CM3) in dollars when Net Sales is $90,000, COGS is $30,000, Logistics is $15,000, and Paid CAC is $25,000 ($90,000 - 30,000 - 15,000 - 25,000$)?",
          "expectedStringOutput": "20000",
          "acceptableAnswers": [
            "20000",
            "$20,000",
            "20,000",
            "cm3\":20000"
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "45000": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "45,000 is CM2 before deducting marketing CAC ($25,000). CM3 = 45,000 - 25,000 = $20,000.",
              "recoveryPath": {
                "simplerExplanation": "45,000 - 25,000 = 20,000.",
                "guidedFixPrompt": "Type 20000"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d16-b2-gmv-vs-net-revenue-distinction",
        "day": 16,
        "blockNumber": 2,
        "title": "GMV vs Net Revenue: Accounting Invariants & Investor Reporting",
        "conceptBudget": {
          "primaryConcept": "GMV vs Revenue Invariant",
          "supportingTerms": [
            "Gross Merchandise Value (GMV: Total value of merchandise transacted including taxes and returns)",
            "Net Revenue (Recognized GAAP revenue after deducting customer returns, chargebacks, and seller discounts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d16-b1-contribution-margin-waterfall",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Revenue Accounting Standards",
            "codeSnippet": "// GMV:         $100M total customer transactions (Vanity headline figure)\n// RETURNS:     $10M returned merchandise refunded to buyers\n// NET REVENUE: $90M recognized top-line GAAP revenue (Audited financial statement!)",
            "lineNotes": {
              "1": "Gross volume metric.",
              "2": "Customer returns deduction.",
              "3": "Audited statutory revenue."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gmv_revenue_demo.js",
            "initialCode": "function calculateNetRevenue(gmv, returns, discounts) {\n  return gmv - returns - discounts;\n}\n\nconsole.log(calculateNetRevenue(100000, 10000, 0));",
            "expectedOutput": "90000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recognized GAAP Net Revenue in dollars for an e-commerce platform processing $100,000 in GMV with $10,000 in customer returns ($100,000 - 10,000$)?",
          "expectedStringOutput": "90000",
          "acceptableAnswers": [
            "90000",
            "$90,000",
            "90,000"
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "100,000 is gross GMV. Returns must be subtracted to report GAAP Net Revenue ($90,000).",
              "recoveryPath": {
                "simplerExplanation": "100,000 - 10,000 = 90,000.",
                "guidedFixPrompt": "Type 90000"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d16-b3-first-order-vs-repurchase-profitability",
        "day": 16,
        "blockNumber": 3,
        "title": "First-Order Breakeven vs Repurchase Pure Margin Compounding",
        "conceptBudget": {
          "primaryConcept": "First-Order CAC Amortization",
          "supportingTerms": [
            "Order 1 (High CAC: CM3 might be $0 or small loss)",
            "Order 2 & 3 (Organic/Email repurchase: $0 CAC $\\implies$ 100% of CM2 drops straight to bottom-line net profit!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d16-b2-gmv-vs-net-revenue-distinction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "repurchase_profit_demo.js",
            "initialCode": "function evaluateOrderProfitability(isRepeatOrder, cm2Profit, cac) {\n  return isRepeatOrder\n    ? cm2Profit\n    : cm2Profit - cac;\n}\n\nconsole.log(evaluateOrderProfitability(false, 45, 40));\nconsole.log(evaluateOrderProfitability(true, 45, 40));",
            "expectedOutput": "5\n45",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars of profit are generated on a repeat customer order with $45 CM2 when customer marketing CAC on repeat orders is $0 ($45 - 0$)?",
          "expectedStringOutput": "45",
          "acceptableAnswers": [
            "45",
            "$45",
            "45.0",
            "$45.00"
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "5 is first-order profit after paying $40 CAC. Repeat orders have $0 CAC, capturing the full $45 CM2.",
              "recoveryPath": {
                "simplerExplanation": "Repeat order profit is $45.",
                "guidedFixPrompt": "Type 45"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Cohort Analysis & Repeat Purchase Rate (RPR)",
    "overviewMetaphor": "Repeat Purchase Rate is a Compounding Engine That Frees You from Paid Ad Slavery: If you acquire 10,000 unique customers in January and 3,200 of them place a second order within 90 days, your Repeat Purchase Rate is 32.0% ($RPR = \\frac{3,200}{10,000} \\times 100\\%$); an RPR above 25.0% proves product-market fit and drives sustainable exponential enterprise value.",
    "blocks": [
      {
        "id": "ecom-d17-b1-repeat-purchase-rate-calculation",
        "day": 17,
        "blockNumber": 1,
        "title": "Repeat Purchase Rate (RPR) Formula: $RPR = \\frac{\\text{Repeat Customers}}{\\text{Total Unique Customers}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Repeat Purchase Rate Formula",
          "supportingTerms": [
            "Total Unique Customers ($10,000$)",
            "Repeat Buyers ($3,200$)",
            "$RPR = \\frac{3,200}{10,000} \\times 100\\% = 32.0\\%$",
            "Benchmark: $\\ge 25.0\\% \\implies$ Strong Compounding Retention; $< 15.0\\% \\implies$ Churn Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d16-b1-contribution-margin-waterfall",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cohort Retention Analysis (10k January Acquisition Cohort)",
              "boxes": [
                {
                  "label": "Acquired Cohort Size",
                  "value": "10,000 Unique Customers who bought in Jan",
                  "varType": "Cohort Base",
                  "isUpdated": false
                },
                {
                  "label": "Repeat Buyers (90-Day)",
                  "value": "3,200 Customers returned and placed 2+ orders",
                  "varType": "Repeat Buyers",
                  "isUpdated": false
                },
                {
                  "label": "Repeat Purchase Rate",
                  "value": "3,200 / 10,000 = 32.00% RPR (STRONG RETENTION & LTV COMPOUNDING!)",
                  "varType": "RPR Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rpr_calc_demo.js",
            "initialCode": "function calculateRpr(total, repeatCount) {\n  const rate = (repeatCount / total) * 100;\n  return {\n    totalCustomers: total,\n    repeatCustomers: repeatCount,\n    rprPercent: Number(rate.toFixed(2)),\n    isHealthy: rate >= 25.0,\n    status: 'RPR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRpr(10000, 3200)));",
            "expectedOutput": "{\"totalCustomers\":10000,\"repeatCustomers\":3200,\"rprPercent\":32,\"isHealthy\":true,\"status\":\"RPR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Repeat Purchase Rate percentage when 3,200 out of 10,000 total customers return to place a second order ($ (3,200 / 10,000) \\times 100 $)?",
          "expectedStringOutput": "32",
          "acceptableAnswers": [
            "32",
            "32%",
            "32.0",
            "rprPercent\":32"
          ],
          "primaryMisconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
          "diagnosisMap": {
            "0.32": {
              "misconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
              "errorExplanation": "0.32 is decimal form. Multiplied by 100 gives an RPR of 32.0%.",
              "recoveryPath": {
                "simplerExplanation": "3,200 / 10,000 * 100 = 32%.",
                "guidedFixPrompt": "Type 32"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d17-b2-repurchase-cycle-lag-days",
        "day": 17,
        "blockNumber": 2,
        "title": "Repurchase Cycle Lag & Automated Replenishment Timing",
        "conceptBudget": {
          "primaryConcept": "Repurchase Lag Interval",
          "supportingTerms": [
            "Consumable products (Coffee, vitamins: 30-day repurchase cycle)",
            "Triggering replenishment SMS at Day 25 (5 days before product runs out) achieves 45% re-order rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d17-b1-repeat-purchase-rate-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Replenishment Timing Schedule",
            "codeSnippet": "// Product Life: 30 Days supply\n// -> DAY 25: Automated WhatsApp: 'Running low on your favorite coffee? 1-click reorder!'\n// -> Result: Frictionless re-order before customer considers competing brands!",
            "lineNotes": {
              "1": "Supply exhaustion period.",
              "2": "Anticipatory trigger.",
              "3": "Frictionless reorder."
            }
          },
          {
            "type": "runnable_code",
            "filename": "repurchase_timing_demo.js",
            "initialCode": "function getReplenishmentTriggerDay(supplyDays) {\n  return supplyDays - 5;\n}\n\nconsole.log(getReplenishmentTriggerDay(30));",
            "expectedOutput": "25",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "On which day should an automated replenishment reminder be dispatched for a consumable product containing a 30-day supply ($30 - 5$)?",
          "expectedStringOutput": "25",
          "acceptableAnswers": [
            "25",
            "Day 25",
            "25th day"
          ],
          "primaryMisconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
              "errorExplanation": "Waiting until Day 30 is too late as the user has already run out. Reorder triggers 5 days early on Day 25.",
              "recoveryPath": {
                "simplerExplanation": "30 - 5 = 25.",
                "guidedFixPrompt": "Type 25"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d17-b3-cohort-retention-matrix-heatmap",
        "day": 17,
        "blockNumber": 3,
        "title": "Cohort Retention Matrices & LTV Expansion Modeling",
        "conceptBudget": {
          "primaryConcept": "Cohort Matrix Analysis",
          "supportingTerms": [
            "Cohort Matrix (Tracking Month 1, Month 3, Month 6, Month 12 cumulative spend per cohort)",
            "Layer-cake revenue growth (Older cohorts generate base revenue while new cohorts stack on top)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d17-b2-repurchase-cycle-lag-days",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "layer_cake_demo.js",
            "initialCode": "function getRevenueCompoundingModel() {\n  return 'LAYER_CAKE_COMPOUNDING_COHORT_REVENUE';\n}\n\nconsole.log(getRevenueCompoundingModel());",
            "expectedOutput": "LAYER_CAKE_COMPOUNDING_COHORT_REVENUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What financial pattern emerges when repeat purchases from historical customer cohorts stack on top of new customer acquisition revenue?",
          "expectedStringOutput": "LAYER_CAKE_COMPOUNDING_COHORT_REVENUE",
          "acceptableAnswers": [
            "LAYER_CAKE_COMPOUNDING_COHORT_REVENUE",
            "Layer Cake Revenue",
            "Compounding Cohort Revenue"
          ],
          "primaryMisconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
          "diagnosisMap": {
            "LINEAR": {
              "misconceptionId": "MC_ECOM_COHORT_REPEAT_PURCHASE_RATE_RPR",
              "errorExplanation": "Cohort revenue stacks exponentially in a layer-cake model.",
              "recoveryPath": {
                "simplerExplanation": "Matches LAYER_CAKE_COMPOUNDING_COHORT_REVENUE.",
                "guidedFixPrompt": "Type LAYER_CAKE_COMPOUNDING_COHORT_REVENUE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "E-Commerce Fraud Prevention & Chargeback Defense (<0.65%)",
    "overviewMetaphor": "Chargeback Defense is Guarding the Vault Door Against Card-Not-Present Criminal Fraud: Visa and Mastercard enforce a strict maximum ceiling of 0.65% for the Chargeback Ratio ($Ratio = \\frac{\\text{Monthly Chargebacks}}{\\text{Total Transactions}} \\times 100\\%$); across 10,000 monthly orders, logging 25 chargebacks produces a safe 0.250% ratio ($0.250\\% \\le 0.65\\%$); exceeding 0.65% (e.g. 85 chargebacks = 0.850%) triggers immediate entry into Visa's Chargeback Monitoring Program, risking catastrophic $50/chargeback penalty fines and merchant account termination.",
    "blocks": [
      {
        "id": "ecom-d18-b1-chargeback-ratio-card-brand-compliance",
        "day": 18,
        "blockNumber": 1,
        "title": "The Visa/Mastercard 0.65% Chargeback Ratio Ceiling & Penalty Thresholds",
        "conceptBudget": {
          "primaryConcept": "Chargeback Ratio Compliance Formula",
          "supportingTerms": [
            "Monthly Chargebacks ($25$)",
            "Monthly Transactions ($10,000$)",
            "$Chargeback Ratio = \\frac{25}{10,000} \\times 100\\% = 0.250\\%$",
            "Card Brand Ceiling: $\\le 0.650\\% \\implies$ Pristine; $> 0.650\\% \\implies$ Excessive Chargeback Monitoring Program"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d17-b1-repeat-purchase-rate-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Chargeback Compliance Ledger (10,000 Monthly Transactions)",
              "boxes": [
                {
                  "label": "Healthy Merchant (25 Disputes)",
                  "value": "25 / 10,000 = 0.250% (<= 0.65% Visa Standard -> PRISTINE HEALTH!)",
                  "varType": "Healthy",
                  "isUpdated": false
                },
                {
                  "label": "High-Risk Merchant (85 Disputes)",
                  "value": "85 / 10,000 = 0.850% (> 0.65% Ceiling -> CARD BRAND FINES & PENALTIES)",
                  "varType": "High Risk",
                  "isUpdated": false
                },
                {
                  "label": "Visa/Mastercard Threshold",
                  "value": "STRICT 0.650% CEILING (Exceeding risks account termination!)",
                  "varType": "Ceiling",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "chargeback_calc_demo.js",
            "initialCode": "function auditChargebackHealth(chargebacks, txCount) {\n  const ratio = (chargebacks / txCount) * 100;\n  const isOk = ratio <= 0.65;\n  return {\n    chargebacks,\n    txCount,\n    chargebackRatioPercent: Number(ratio.toFixed(3)),\n    isCompliant: isOk,\n    status: isOk ? 'PRISTINE_CHARGEBACK_HEALTH' : 'EXCESSIVE_CHARGEBACK_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditChargebackHealth(25, 10000)));\nconsole.log(JSON.stringify(auditChargebackHealth(85, 10000)));",
            "expectedOutput": "{\"chargebacks\":25,\"txCount\":10000,\"chargebackRatioPercent\":0.25,\"isCompliant\":true,\"status\":\"PRISTINE_CHARGEBACK_HEALTH\"}\n{\"chargebacks\":85,\"txCount\":10000,\"chargebackRatioPercent\":0.85,\"isCompliant\":false,\"status\":\"EXCESSIVE_CHARGEBACK_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the chargeback ratio percentage when an online store incurs 25 customer chargebacks across 10,000 monthly transactions ($ (25 / 10,000) \\times 100 $)?",
          "expectedStringOutput": "0.25",
          "acceptableAnswers": [
            "0.25",
            "0.25%",
            "0.250",
            "chargebackRatioPercent\":0.25"
          ],
          "primaryMisconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
          "diagnosisMap": {
            "2.5": {
              "misconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
              "errorExplanation": "2.5% is 25 / 1,000. 25 / 10,000 is 0.250%.",
              "recoveryPath": {
                "simplerExplanation": "25 / 10,000 * 100 = 0.25%.",
                "guidedFixPrompt": "Type 0.25"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d18-b2-avs-cvv-velocity-checks",
        "day": 18,
        "blockNumber": 2,
        "title": "Automated Fraud Filters: AVS Address Matching, CVV & IP Velocity Limits",
        "conceptBudget": {
          "primaryConcept": "Automated Fraud Filter Triad",
          "supportingTerms": [
            "Address Verification Service (AVS: Matching billing ZIP against cardholder bank)",
            "CVV2 Card Verification Value check",
            "IP Velocity Limit (Blocking IP if >3 checkout attempts in 1 hour)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d18-b1-chargeback-ratio-card-brand-compliance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fraud Filter Rules",
            "codeSnippet": "// Rule 1: CVV Mismatch?                  -> REJECT_IMMEDIATELY\n// Rule 2: High IP Velocity (5 cards/hr)?  -> BLOCK_IP_SUSPECTED_CARD_TESTING_BOT\n// Rule 3: Billing Country != IP Country?  -> TRIGGER_MANUAL_REVIEW",
            "lineNotes": {
              "1": "Security code check.",
              "2": "Bot attack prevention.",
              "3": "Geo discrepancy check."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fraud_filter_demo.js",
            "initialCode": "function evaluateFraudRisk(cvvPass, attemptsLastHour) {\n  if (!cvvPass) return 'REJECT_CVV_MISMATCH';\n  if (attemptsLastHour > 3) return 'BLOCK_EXCESSIVE_VELOCITY';\n  return 'APPROVE_TRANSACTION';\n}\n\nconsole.log(evaluateFraudRisk(true, 1));\nconsole.log(evaluateFraudRisk(false, 1));\nconsole.log(evaluateFraudRisk(true, 5));",
            "expectedOutput": "APPROVE_TRANSACTION\nREJECT_CVV_MISMATCH\nBLOCK_EXCESSIVE_VELOCITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security action is triggered when an automated bot attempts 5 consecutive checkout transactions from the same IP address in under an hour?",
          "expectedStringOutput": "BLOCK_EXCESSIVE_VELOCITY",
          "acceptableAnswers": [
            "BLOCK_EXCESSIVE_VELOCITY",
            "Block IP",
            "Excessive velocity"
          ],
          "primaryMisconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
          "diagnosisMap": {
            "APPROVE": {
              "misconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
              "errorExplanation": "High velocity is a card-testing attack. It triggers BLOCK_EXCESSIVE_VELOCITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCK_EXCESSIVE_VELOCITY.",
                "guidedFixPrompt": "Type BLOCK_EXCESSIVE_VELOCITY"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d18-b3-representment-compelling-evidence",
        "day": 18,
        "blockNumber": 3,
        "title": "Chargeback Representment & Submitting Compelling Evidence",
        "conceptBudget": {
          "primaryConcept": "Chargeback Representment Evidence",
          "supportingTerms": [
            "Compelling Evidence (Signed proof of delivery, IP match, carrier GPS coordinates, customer email thread)",
            "Recovers 60-70% of fraudulent 'Friendly Fraud' chargebacks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d18-b2-avs-cvv-velocity-checks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "representment_demo.js",
            "initialCode": "function evaluateRepresentment(hasSignedPod, hasGpsMatch) {\n  return hasSignedPod && hasGpsMatch\n    ? 'WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE'\n    : 'DISPUTE_LOST_INSUFFICIENT_EVIDENCE';\n}\n\nconsole.log(evaluateRepresentment(true, true));",
            "expectedOutput": "WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What winning outcome is achieved when an e-commerce merchant submits carrier signature proof-of-delivery and GPS delivery coordinates in a chargeback representment case?",
          "expectedStringOutput": "WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE",
          "acceptableAnswers": [
            "WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE",
            "Win Dispute",
            "Win Chargeback"
          ],
          "primaryMisconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
          "diagnosisMap": {
            "LOST": {
              "misconceptionId": "MC_ECOM_FRAUD_PREVENTION_CHARGEBACK_DEFENSE",
              "errorExplanation": "Signed delivery and GPS data constitute compelling evidence, winning the dispute.",
              "recoveryPath": {
                "simplerExplanation": "Matches WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE.",
                "guidedFixPrompt": "Type WIN_CHARGEBACK_DISPUTE_VIA_COMPELLING_EVIDENCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Omnichannel Retail & POS Synchronization: BOPIS & BORIS",
    "overviewMetaphor": "Omnichannel Retail is Merging Physical Stores and the Digital Cloud into a Single Living Network: When a customer buys online and chooses Buy Online, Pick Up in Store (BOPIS), the system checks store inventory; if Store Mumbai has 10 units in stock and the customer orders 2 units ($10 \\ge 2$), the order is instantly approved for pickup within 2 hours; if stock is insufficient, the system automatically routes a warehouse ship-to-store transfer, creating a unified customer experience.",
    "blocks": [
      {
        "id": "ecom-d19-b1-bopis-fulfillment-routing",
        "day": 19,
        "blockNumber": 1,
        "title": "BOPIS (Buy Online, Pick Up In Store) Local Inventory Allocation Engine",
        "conceptBudget": {
          "primaryConcept": "BOPIS Inventory Routing Logic",
          "supportingTerms": [
            "Buy Online, Pick Up in Store (BOPIS)",
            "Available Store Stock ($10$ units) $\\ge$ Requested Units ($2$ units) $\\implies$ Instant 2-Hour Pickup Approval",
            "Insufficient Stock $\\implies$ Trigger Ship-to-Store warehouse transfer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d18-b1-chargeback-ratio-card-brand-compliance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BOPIS Routing Decision Matrix",
              "boxes": [
                {
                  "label": "Customer Online Order",
                  "value": "2 Units requested for local pickup at Store Mumbai",
                  "varType": "Requested Units",
                  "isUpdated": false
                },
                {
                  "label": "Physical Store Inventory",
                  "value": "10 Units available on retail floor shelves",
                  "varType": "Store Stock",
                  "isUpdated": false
                },
                {
                  "label": "BOPIS Routing SLA",
                  "value": "APPROVED: READY FOR PICKUP IN TWO HOURS! (0 freight cost!)",
                  "varType": "Pickup SLA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bopis_routing_demo.js",
            "initialCode": "function evaluateBopis(requestedUnits, storeStock) {\n  const canFulfill = storeStock >= requestedUnits;\n  return {\n    requestedUnits,\n    storeStock,\n    isApproved: canFulfill,\n    pickupSla: canFulfill ? 'READY_FOR_PICKUP_IN_TWO_HOURS' : 'SHIP_TO_STORE_TRANSFER',\n    status: 'BOPIS_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBopis(2, 10)));\nconsole.log(JSON.stringify(evaluateBopis(5, 2)));",
            "expectedOutput": "{\"requestedUnits\":2,\"storeStock\":10,\"isApproved\":true,\"pickupSla\":\"READY_FOR_PICKUP_IN_TWO_HOURS\",\"status\":\"BOPIS_EVALUATED\"}\n{\"requestedUnits\":5,\"storeStock\":2,\"isApproved\":false,\"pickupSla\":\"SHIP_TO_STORE_TRANSFER\",\"status\":\"BOPIS_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pickup SLA status is confirmed when local store stock (10 units) exceeds customer requested order units (2 units)?",
          "expectedStringOutput": "READY_FOR_PICKUP_IN_TWO_HOURS",
          "acceptableAnswers": [
            "READY_FOR_PICKUP_IN_TWO_HOURS",
            "Ready in two hours",
            "Pickup in two hours"
          ],
          "primaryMisconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
          "diagnosisMap": {
            "TRANSFER": {
              "misconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
              "errorExplanation": "Sufficient store stock fulfills immediately. It achieves READY_FOR_PICKUP_IN_TWO_HOURS.",
              "recoveryPath": {
                "simplerExplanation": "Matches READY_FOR_PICKUP_IN_TWO_HOURS.",
                "guidedFixPrompt": "Type READY_FOR_PICKUP_IN_TWO_HOURS"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d19-b2-boris-in-store-returns-upsell",
        "day": 19,
        "blockNumber": 2,
        "title": "BORIS (Buy Online, Return In Store): Foot Traffic & The 30% In-Store Upsell",
        "conceptBudget": {
          "primaryConcept": "BORIS Upsell Economics",
          "supportingTerms": [
            "Buy Online, Return in Store (BORIS)",
            "Customers returning items in physical stores buy additional items 30% of the time, turning a return into net positive revenue"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d19-b1-bopis-fulfillment-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BORIS Omnichannel Advantage",
            "codeSnippet": "// 1. Customer enters physical store to return online shirt\n// 2. Associate processes instant exchange in 60 seconds\n// 3. Customer browses store aisles and buys $75 jacket -> Net positive sale!",
            "lineNotes": {
              "1": "Zero shipping return.",
              "2": "Instant satisfaction.",
              "3": "Omnichannel foot traffic monetization."
            }
          },
          {
            "type": "runnable_code",
            "filename": "boris_demo.js",
            "initialCode": "function getBorisAdvantage() {\n  return 'ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL';\n}\n\nconsole.log(getBorisAdvantage());",
            "expectedOutput": "ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do omnichannel retailers prioritize Buy Online, Return in Store (BORIS) workflows over mail-in returns?",
          "expectedStringOutput": "ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL",
          "acceptableAnswers": [
            "ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL",
            "Zero return shipping",
            "In store upsell"
          ],
          "primaryMisconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
          "diagnosisMap": {
            "EXPENSIVE": {
              "misconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
              "errorExplanation": "In-store returns eliminate return freight and drive retail foot traffic upsells.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL.",
                "guidedFixPrompt": "Type ZERO_RETURN_SHIPPING_AND_30_PERCENT_IN_STORE_UPSELL"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d19-b3-pos-centralized-inventory-sync",
        "day": 19,
        "blockNumber": 3,
        "title": "Real-Time POS Point-of-Sale & Online Centralized Inventory Synchronization",
        "conceptBudget": {
          "primaryConcept": "POS & Online Real-Time Inventory Sync",
          "supportingTerms": [
            "POS cash register scan in physical retail store instantly decrements central database inventory in $<500$ms",
            "Prevents selling the last item online while an in-store customer is buying it"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d19-b2-boris-in-store-returns-upsell",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pos_sync_demo.js",
            "initialCode": "function evaluatePosSync(isRealTime) {\n  return isRealTime\n    ? 'PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER'\n    : 'HIGH_RISK_OF_DOUBLE_SELLING_INVENTORY';\n}\n\nconsole.log(evaluatePosSync(true));",
            "expectedOutput": "PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical operational hazard is eliminated when physical store POS registers synchronize in real-time with the online e-commerce database?",
          "expectedStringOutput": "PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER",
          "acceptableAnswers": [
            "PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER",
            "Prevents overselling",
            "Prevents double selling"
          ],
          "primaryMisconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
          "diagnosisMap": {
            "DOUBLE_SELL": {
              "misconceptionId": "MC_ECOM_OMNICHANNEL_BOPIS_BORIS_POS_SYNC",
              "errorExplanation": "Syncing prevents overselling. It achieves PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER.",
                "guidedFixPrompt": "Type PREVENTS_OUT_OF_STOCK_OVERSELLING_BUFFER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Cross-Border International E-Commerce: Harmonized System (HS) & DDP Duties",
    "overviewMetaphor": "Delivered Duty Paid (DDP) is an All-Inclusive First-Class Boarding Pass for International Shipments: When a customer in London orders a $100.00 item with $20.00 international shipping ($120.00 CIF Value), a 10% customs tariff adds $12.00 ($120 \\times 0.10$), and a 20% local VAT on the duty-inclusive sum ($132 \\times 0.20$) adds $26.40; under Delivered Duty Paid (DDP), the customer pays the full $158.40 Landed Cost at checkout, ensuring the parcel glides through customs with zero surprise ransom fees at the door.",
    "blocks": [
      {
        "id": "ecom-d20-b1-ddp-landed-cost-calculation",
        "day": 20,
        "blockNumber": 1,
        "title": "DDP (Delivered Duty Paid) Landed Cost Formula: $\\text{CIF} + \\text{Duty} + \\text{VAT}$",
        "conceptBudget": {
          "primaryConcept": "DDP Landed Cost Calculation",
          "supportingTerms": [
            "Item Value ($100.00$) + International Shipping ($20.00$) = $120.00$ CIF Value",
            "Customs Duty ($10.0\\% \\implies \\$12.00$)",
            "Import VAT ($20.0\\%$ of $(\\$120 + \\$12) = 20\\% \\text{ of } \\$132 = \\$26.40$)",
            "Total DDP Landed Cost = $120 + 12 + 26.40 = \\$158.40$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d19-b1-bopis-fulfillment-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cross-Border DDP Tariff & VAT Waterfall ($100 Item + $20 Shipping)",
              "boxes": [
                {
                  "label": "CIF Base (Item + Shipping)",
                  "value": "$100.00 + $20.00 = $120.00 CIF Value Base",
                  "varType": "CIF",
                  "isUpdated": false
                },
                {
                  "label": "Customs Duty (10%)",
                  "value": "$120.00 x 10.0% = $12.00 Customs Import Tariff",
                  "varType": "Duty",
                  "isUpdated": false
                },
                {
                  "label": "Import VAT & Total DDP",
                  "value": "VAT 20% on $132 = $26.40 -> TOTAL DDP LANDED COST = $158.40!",
                  "varType": "Total DDP",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ddp_calc_demo.js",
            "initialCode": "function calculateDdpLandedCost(itemVal, shipping, dutyPct, vatPct) {\n  const cif = itemVal + shipping;\n  const duty = cif * (dutyPct / 100);\n  const vat = (cif + duty) * (vatPct / 100);\n  const total = cif + duty + vat;\n  return {\n    cifValue: cif,\n    customsDuty: Number(duty.toFixed(2)),\n    importVat: Number(vat.toFixed(2)),\n    totalLandedCost: Number(total.toFixed(2)),\n    status: 'DDP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDdpLandedCost(100, 20, 10, 20)));",
            "expectedOutput": "{\"cifValue\":120,\"customsDuty\":12,\"importVat\":26.4,\"totalLandedCost\":158.4,\"status\":\"DDP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total DDP Landed Cost for an international order with $100 item value, $20 shipping, 10% customs duty, and 20% import VAT ($ 120 + 12 + 26.40 $)?",
          "expectedStringOutput": "158.4",
          "acceptableAnswers": [
            "158.4",
            "158.40",
            "$158.40",
            "totalLandedCost\":158.4"
          ],
          "primaryMisconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
          "diagnosisMap": {
            "132": {
              "misconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
              "errorExplanation": "132 forgets the import VAT ($26.40). Total Landed Cost = $120 + $12 + $26.40 = $158.40.",
              "recoveryPath": {
                "simplerExplanation": "120 + 12 + 26.40 = 158.40.",
                "guidedFixPrompt": "Type 158.4"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d20-b2-harmonized-system-hs-codes",
        "day": 20,
        "blockNumber": 2,
        "title": "Harmonized System (HS) Codes & International Tariff Classification",
        "conceptBudget": {
          "primaryConcept": "HS Code Global Classification",
          "supportingTerms": [
            "HS Code (6-digit global trade taxonomy e.g. `6109.10` Cotton T-Shirts)",
            "Determines exact statutory customs tariff and duty rates in importing countries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d20-b1-ddp-landed-cost-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HS Code Structure",
            "codeSnippet": "// Chapter 61: Apparel & Clothing Accessories (Knitted)\n// Heading 09:  T-shirts, singlets and other vests\n// Subheading 10: Of cotton -> Full HS Code: 6109.10",
            "lineNotes": {
              "1": "2-digit chapter.",
              "2": "4-digit heading.",
              "3": "6-digit international subheading."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hs_code_demo.js",
            "initialCode": "function getHsCodeStandardLength() {\n  return 6;\n}\n\nconsole.log(getHsCodeStandardLength());",
            "expectedOutput": "6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many digits compose the internationally standardized universal Harmonized System (HS) product classification code?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 digits",
            "Six digits"
          ],
          "primaryMisconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
              "errorExplanation": "10 digits is national country-specific tariff extension. The universal international HS code is 6 digits.",
              "recoveryPath": {
                "simplerExplanation": "Standard international HS code has 6 digits.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d20-b3-ddp-vs-ddu-customer-experience",
        "day": 20,
        "blockNumber": 3,
        "title": "DDP vs DDU: Why Delivered Duty Unpaid (DDU) Destroys Cross-Border Brands",
        "conceptBudget": {
          "primaryConcept": "DDP vs DDU Experience Invariant",
          "supportingTerms": [
            "DDU (Customer shocked by unexpected customs ransom fees upon delivery $\\implies 40\\%$ return refusal)",
            "DDP (100% prepaid customs clearance $\\implies 98\\%$ successful delivery rate)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d20-b2-harmonized-system-hs-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ddp_vs_ddu_demo.js",
            "initialCode": "function evaluateCrossBorderMethod(isDdp) {\n  return isDdp\n    ? 'SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES'\n    : 'SURPRISE_CUSTOMS_FEES_40_PERCENT_PACKAGE_REFUSAL';\n}\n\nconsole.log(evaluateCrossBorderMethod(true));\nconsole.log(evaluateCrossBorderMethod(false));",
            "expectedOutput": "SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES\nSURPRISE_CUSTOMS_FEES_40_PERCENT_PACKAGE_REFUSAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What customer experience outcome is delivered when an international store ships via Delivered Duty Paid (DDP) terms?",
          "expectedStringOutput": "SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES",
          "acceptableAnswers": [
            "SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES",
            "Zero surprise fees",
            "Seamless delivery"
          ],
          "primaryMisconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
          "diagnosisMap": {
            "SURPRISE": {
              "misconceptionId": "MC_ECOM_CROSS_BORDER_DDP_HS_CODES_CUSTOMS",
              "errorExplanation": "DDU causes surprise fees. DDP ensures seamless delivery with zero surprise fees.",
              "recoveryPath": {
                "simplerExplanation": "Matches SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES.",
                "guidedFixPrompt": "Type SEAMLESS_DOORSTEP_DELIVERY_ZERO_SURPRISE_FEES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign e-commerce unit economics, cohort retention, and global trade suite: 1. Contribution Margin 3 (CM3) waterfall calculation ($20,000$ net profit from $90,000$ net sales = $22.22\\%$); 2. Cohort Repeat Purchase Rate analysis ($32.0\\%$ RPR); 3. Chargeback compliance monitoring ($0.250\\% \\le 0.65\\%$); 4. BOPIS omnichannel in-store fulfillment routing (2-hour SLA); 5. DDP cross-border landed cost calculation ($158.40$).",
    "blocks": [
      {
        "id": "ecom-d21-b1-financials-global-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "E-Commerce Financials & Global Operations Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Financials & Global Engine Synthesis",
          "supportingTerms": [
            "CM3 Waterfall Engine",
            "RPR Cohort Engine",
            "Chargeback Auditor",
            "BOPIS Router",
            "DDP Landed Cost Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d20-b3-ddp-vs-ddu-customer-experience",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Financials & Global Operations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates CM3 $20,000 net profit (22.22% margin)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Evaluates 32% Repeat Purchase Rate cohort compounding",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits 0.25% chargeback ratio & BOPIS 2-hour store pickup",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Calculates $158.40 DDP landed cost and certifies financial engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "financials_global_kernel_demo.js",
            "initialCode": "function runFinancialsGlobalEngine() {\n  return {\n    cm3Subsystem: 'ONLINE_CM3_WATERFALL_ACTIVE',\n    rprSubsystem: 'ONLINE_RPR_COHORTS_ACTIVE',\n    chargebackSubsystem: 'ONLINE_CHARGEBACK_DEFENSE_ACTIVE',\n    bopisSubsystem: 'ONLINE_BOPIS_ROUTER_ACTIVE',\n    ddpSubsystem: 'ONLINE_DDP_LANDED_COST_ACTIVE',\n    engineStatus: 'ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runFinancialsGlobalEngine().engineStatus);",
            "expectedOutput": "ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the E-Commerce Financials & Global Operations Master Engine?",
          "expectedStringOutput": "ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE",
            "engineStatus: ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "Matches ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ECOMMERCE_FINANCIALS_AND_GLOBAL_OPERATIONS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d21-b2-financials-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Financials & Global Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Financial Invariant Verification",
          "supportingTerms": [
            "CM3 Invariant",
            "RPR Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d21-b1-financials-global-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "financials_audit_demo.js",
            "initialCode": "function auditFinancialsEngine(cm3Valid, rprValid, cbValid, ddpValid) {\n  const passed = cm3Valid && rprValid && cbValid && ddpValid;\n  return {\n    cm3Verified: cm3Valid,\n    rprVerified: rprValid,\n    chargebackVerified: cbValid,\n    ddpVerified: ddpValid,\n    grade: passed ? 'FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFinancialsEngine(true, true, true, true)));",
            "expectedOutput": "{\"cm3Verified\":true,\"rprVerified\":true,\"chargebackVerified\":true,\"ddpVerified\":true,\"grade\":\"FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when CM3, RPR, Chargeback, and DDP engines pass 100%?",
          "expectedStringOutput": "FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED",
            "grade\":\"FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "All checks passing awards FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type FINANCIALS_GLOBAL_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d21-b3-milestone3-ecom-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 E-Commerce Financials & Global Operations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Financial Operations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d21-b2-financials-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_ecom_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_UNIT_ECONOMICS_GMV_CONTRIBUTION_MARGIN",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete E-Commerce Financials, Repeat Cohorts & Global Operations Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Subscription E-Commerce Models: MRR, ARR & Monthly Churn (<3%)",
    "overviewMetaphor": "Subscription E-Commerce is Building an Automatic Revenue Clock: With 5,000 active subscribers paying $30.00/month, your store generates $150,000 in Monthly Recurring Revenue (MRR = $150k); maintaining a low 2.0% monthly churn rate loses only 100 subscribers ($3,000 lost revenue), guaranteeing a stable baseline of $147,000 in recurring revenue before a single dollar of new advertising is spent next month.",
    "blocks": [
      {
        "id": "ecom-d22-b1-mrr-and-churn-waterfall-calculation",
        "day": 22,
        "blockNumber": 1,
        "title": "Subscription MRR & Monthly Churn Loss: $\\text{Next MRR} = \\text{MRR} - (\\text{Subscribers} \\times \\text{Churn}\\% \\times \\text{Price})$",
        "conceptBudget": {
          "primaryConcept": "Subscription MRR Waterfall Formula",
          "supportingTerms": [
            "Subscribers ($5,000$)",
            "Monthly Price ($30.00$)",
            "Current MRR = $5,000 \\times \\$30 = \\$150,000$",
            "Monthly Churn ($2.0\\% \\implies 100$ churned subscribers = $\\$3,000$ lost)",
            "Next Month Projected MRR = $150,000 - 3,000 = \\$147,000$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d21-b1-financials-global-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Subscription Recurring Waterfall (5,000 Subs @ $30/mo, 2% Churn)",
              "boxes": [
                {
                  "label": "Current Active MRR",
                  "value": "5,000 Subs x $30.00 = $150,000.00 Monthly Recurring Revenue",
                  "varType": "MRR",
                  "isUpdated": false
                },
                {
                  "label": "Monthly Churn Loss (2%)",
                  "value": "100 Churned Subs x $30.00 = -$3,000.00 Churned Revenue",
                  "varType": "Churn Loss",
                  "isUpdated": false
                },
                {
                  "label": "Next Month Baseline MRR",
                  "value": "$150,000 - $3,000 = $147,000.00 AUTOMATIC RECURRING BASELINE!",
                  "varType": "Baseline",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mrr_calc_demo.js",
            "initialCode": "function calculateMrrWaterfall(subs, price, churnPct) {\n  const currentMrr = subs * price;\n  const churnLoss = Math.round(subs * (churnPct / 100)) * price;\n  const nextMrr = currentMrr - churnLoss;\n  return {\n    currentMrr,\n    churnLoss,\n    nextMonthMrr: nextMrr,\n    status: 'MRR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMrrWaterfall(5000, 30, 2)));",
            "expectedOutput": "{\"currentMrr\":150000,\"churnLoss\":3000,\"nextMonthMrr\":147000,\"status\":\"MRR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the projected baseline MRR in dollars for next month when 5,000 subscribers paying $30/mo experience a 2.0% monthly churn rate ($150,000 - 3,000$)?",
          "expectedStringOutput": "147000",
          "acceptableAnswers": [
            "147000",
            "$147,000",
            "147,000",
            "nextMonthMrr\":147000"
          ],
          "primaryMisconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
          "diagnosisMap": {
            "150000": {
              "misconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
              "errorExplanation": "150,000 is gross MRR before churn. Next month's baseline after 2% churn is $147,000.",
              "recoveryPath": {
                "simplerExplanation": "150,000 - 3,000 = 147,000.",
                "guidedFixPrompt": "Type 147000"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d22-b2-three-subscription-archetypes",
        "day": 22,
        "blockNumber": 2,
        "title": "The 3 Subscription Models: Replenishment, Curation & Access",
        "conceptBudget": {
          "primaryConcept": "The 3 Subscription Archetypes",
          "supportingTerms": [
            "Replenishment (Convenience: Dollar Shave Club, Coffee refills)",
            "Curation (Surprise & Delight: Birchbox, Stitch Fix)",
            "Access (Perks & VIP Pricing: Amazon Prime, Costco Member)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d22-b1-mrr-and-churn-waterfall-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Subscription Archetypes",
            "codeSnippet": "// REPLENISHMENT: Coffee beans delivered every 30 days (High retention!)\n// CURATION:      Monthly box of 5 gourmet artisanal cheeses\n// ACCESS:         $99/yr for free 1-day shipping and exclusive member sales",
            "lineNotes": {
              "1": "Replenishment utility.",
              "2": "Curation discovery.",
              "3": "Access membership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "subscription_models_demo.js",
            "initialCode": "function classifySubscription(type) {\n  if (type === 'COFFEE_REFILLS') return 'REPLENISHMENT_SUBSCRIPTION';\n  if (type === 'SURPRISE_BOX') return 'CURATION_SUBSCRIPTION';\n  return 'ACCESS_MEMBERSHIP_SUBSCRIPTION';\n}\n\nconsole.log(classifySubscription('COFFEE_REFILLS'));\nconsole.log(classifySubscription('SURPRISE_BOX'));",
            "expectedOutput": "REPLENISHMENT_SUBSCRIPTION\nCURATION_SUBSCRIPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an e-commerce subscription model delivering automated monthly coffee bean refills classified across the 3 subscription archetypes?",
          "expectedStringOutput": "REPLENISHMENT_SUBSCRIPTION",
          "acceptableAnswers": [
            "REPLENISHMENT_SUBSCRIPTION",
            "Replenishment",
            "Replenishment Subscription"
          ],
          "primaryMisconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
          "diagnosisMap": {
            "CURATION": {
              "misconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
              "errorExplanation": "Curation is discovery of new items. Replenishment delivers automated commodity refills.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLENISHMENT_SUBSCRIPTION.",
                "guidedFixPrompt": "Type REPLENISHMENT_SUBSCRIPTION"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d22-b3-subscriber-churn-reduction-tactics",
        "day": 22,
        "blockNumber": 3,
        "title": "Churn Reduction: 'Pause Subscription' & Flexible Delivery Frequencies",
        "conceptBudget": {
          "primaryConcept": "Subscriber Retention Workflows",
          "supportingTerms": [
            "Offering a 'Pause for 30 Days' option at cancellation prevents 40% of permanent churn",
            "Allowing users to switch delivery frequency (Every 2, 4, or 6 weeks) eliminates product stockpile churn"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d22-b2-three-subscription-archetypes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pause_sub_demo.js",
            "initialCode": "function evaluateCancellationFlow(offersPauseOption) {\n  return offersPauseOption\n    ? 'SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION'\n    : 'PERMANENT_100_PERCENT_CHURN_LOSS';\n}\n\nconsole.log(evaluateCancellationFlow(true));",
            "expectedOutput": "SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cancellation flow feature prevents 40% of permanent subscriber churn by allowing customers with temporary product stockpiles to postpone their next delivery?",
          "expectedStringOutput": "SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION",
          "acceptableAnswers": [
            "SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION",
            "Pause Option",
            "Pause Subscription"
          ],
          "primaryMisconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
          "diagnosisMap": {
            "HARD_CANCEL": {
              "misconceptionId": "MC_ECOM_SUBSCRIPTION_COMMERCE_MRR_CHURN",
              "errorExplanation": "Hard cancels lose the customer permanently. Offering a pause option saves 40% of subscribers.",
              "recoveryPath": {
                "simplerExplanation": "Matches SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION.",
                "guidedFixPrompt": "Type SAVES_40_PERCENT_OF_SUBSCRIBERS_VIA_PAUSE_OPTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "D2C Brand Building & Custom Packaging Economics",
    "overviewMetaphor": "The Custom Packaging Unboxing Experience is a Viral Billboard Delivered Straight into the Customer's Living Room: Upgrading from a $0.40 generic brown box to a $1.20 custom-printed matte mailer box with branded tissue paper ($0.80 incremental cost per order) costs $8,000 across 10,000 orders ($10,000 \\times \\$0.80$); when delighted customers film unboxing videos generating $25,000 in viral UGC sales lift, the net profit uplift is $17,000, producing a massive 212.5% ROI on packaging.",
    "blocks": [
      {
        "id": "ecom-d23-b1-unboxing-roi-calculation",
        "day": 23,
        "blockNumber": 1,
        "title": "Custom Packaging Investment vs Viral UGC Sales ROI: $\\text{ROI} = \\frac{\\text{Lift} - \\text{Investment}}{\\text{Investment}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Packaging Experience ROI Formula",
          "supportingTerms": [
            "Custom Box ($1.20$) vs Generic Box ($0.40$) $\\implies +\\$0.80$ incremental packaging cost",
            "Orders ($10,000$) $\\implies$ Total Packaging Investment = $10,000 \\times \\$0.80 = \\$8,000$",
            "Viral UGC Generated Sales Lift ($25,000.00$)",
            "Net Profit Lift = $25,000 - 8,000 = \\$17,000$",
            "Packaging ROI = $\\frac{17,000}{8,000} \\times 100\\% = 212.5\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d22-b1-mrr-and-churn-waterfall-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Packaging Experience Financial Ledger (10,000 Orders)",
              "boxes": [
                {
                  "label": "Incremental Packaging Cost",
                  "value": "10,000 x ($1.20 Custom - $0.40 Generic) = $8,000.00 Investment",
                  "varType": "Cost",
                  "isUpdated": false
                },
                {
                  "label": "Viral UGC Sales Lift",
                  "value": "$25,000.00 Organic sales generated from unboxing videos",
                  "varType": "Revenue Lift",
                  "isUpdated": false
                },
                {
                  "label": "Net Profit Uplift & ROI",
                  "value": "$17,000.00 Net Profit Lift -> 212.50% PACKAGING ROI!",
                  "varType": "ROI",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "packaging_roi_calc_demo.js",
            "initialCode": "function calculatePackagingRoi(customCost, genericCost, orders, liftRev) {\n  const inv = orders * (customCost - genericCost);\n  const netLift = liftRev - inv;\n  const roiPct = (netLift / inv) * 100;\n  return {\n    incrementalInvestment: inv,\n    netProfitLift: netLift,\n    packagingRoiPercent: Number(roiPct.toFixed(2)),\n    status: 'ROI_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePackagingRoi(1.20, 0.40, 10000, 25000)));",
            "expectedOutput": "{\"incrementalInvestment\":8000,\"netProfitLift\":17000,\"packagingRoiPercent\":212.5,\"status\":\"ROI_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the packaging ROI percentage when an $8,000 custom packaging investment generates $25,000 in viral UGC sales lift ($ (17,000 / 8,000) \\times 100 $)?",
          "expectedStringOutput": "212.5",
          "acceptableAnswers": [
            "212.5",
            "212.5%",
            "packagingRoiPercent\":212.5"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
          "diagnosisMap": {
            "312.5": {
              "misconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
              "errorExplanation": "312.5% is gross revenue over investment (25k / 8k). Net ROI subtracts the investment: 17k / 8k = 212.5%.",
              "recoveryPath": {
                "simplerExplanation": "(25,000 - 8,000) / 8,000 * 100 = 212.5%.",
                "guidedFixPrompt": "Type 212.5"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d23-b2-vip-loyalty-tiers-points-economy",
        "day": 23,
        "blockNumber": 2,
        "title": "VIP Loyalty Tiers & Points-to-Cash Gamification Engines",
        "conceptBudget": {
          "primaryConcept": "Loyalty Program Gamification",
          "supportingTerms": [
            "Silver (1 pt/$1), Gold (1.5 pts/$1), Platinum (2 pts/$1 + Free express shipping)",
            "Points redemption (100 pts = $5 off next order) increases repurchase velocity by 38%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d23-b1-unboxing-roi-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Loyalty Tier Multipliers",
            "codeSnippet": "// SILVER ($0 - $200 annual spend):   1.0x points multiplier\n// GOLD ($200 - $500 annual spend):   1.5x points multiplier + early product access\n// PLATINUM ($500+ annual spend):    2.0x points multiplier + free 1-day express delivery!",
            "lineNotes": {
              "1": "Base tier.",
              "2": "Mid tier.",
              "3": "VIP tier."
            }
          },
          {
            "type": "runnable_code",
            "filename": "loyalty_tier_demo.js",
            "initialCode": "function getLoyaltyMultiplier(annualSpend) {\n  if (annualSpend >= 500) return 2.0;\n  if (annualSpend >= 200) return 1.5;\n  return 1.0;\n}\n\nconsole.log(getLoyaltyMultiplier(650));\nconsole.log(getLoyaltyMultiplier(100));",
            "expectedOutput": "2\n1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What points multiplier is awarded to a Platinum VIP customer with $650 in annual spend?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2x",
            "2.0x"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
              "errorExplanation": "1 is the Silver base multiplier. Platinum VIP members spend >= $500 and receive a 2.0x multiplier.",
              "recoveryPath": {
                "simplerExplanation": "Spend >= 500 awards 2x.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d23-b3-insert-cards-qr-review-funnels",
        "day": 23,
        "blockNumber": 3,
        "title": "Package Insert Cards & QR Code Review Capture Funnels",
        "conceptBudget": {
          "primaryConcept": "Package Insert QR Funnels",
          "supportingTerms": [
            "Physical Insert Card with QR code: 'Scan to unlock free warranty + 15% off next order'",
            "Captures 25% of marketplace Amazon/Flipkart buyers into your proprietary D2C email funnel"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d23-b2-vip-loyalty-tiers-points-economy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "insert_funnel_demo.js",
            "initialCode": "function getInsertFunnelPurpose() {\n  return 'CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS';\n}\n\nconsole.log(getInsertFunnelPurpose());",
            "expectedOutput": "CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What primary growth objective is achieved by placing a QR warranty registration insert card inside marketplace product packaging?",
          "expectedStringOutput": "CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS",
          "acceptableAnswers": [
            "CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS",
            "Convert marketplace buyers",
            "Capture D2C subscribers"
          ],
          "primaryMisconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
          "diagnosisMap": {
            "JUNK": {
              "misconceptionId": "MC_ECOM_D2C_BRANDING_UNBOXING_EXPERIENCE",
              "errorExplanation": "Insert cards are high-value funnels that convert marketplace buyers into first-party D2C subscribers.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS.",
                "guidedFixPrompt": "Type CONVERT_MARKETPLACE_BUYERS_INTO_PROPRIETARY_D2C_SUBSCRIBERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "B2B E-Commerce & Wholesale Portals: Net 30/60 Invoicing & Tiered Price Lists",
    "overviewMetaphor": "B2B E-Commerce is Running a Private VIP Wholesale Trade Exchange: When an authorized distributor logs in to your wholesale portal to purchase 500 units of a $100.00 MSRP item, their 'Distributor Tier' automatically applies a 50% discount ($50.00/unit wholesale price), generating a $25,000.00 total corporate invoice ($500 \\times \\$50$) with Net 60-day credit payment terms.",
    "blocks": [
      {
        "id": "ecom-d24-b1-b2b-tiered-pricing-invoicing",
        "day": 24,
        "blockNumber": 1,
        "title": "B2B Tiered Discounting & Net Terms: $\\text{Invoice} = \\text{Units} \\times [\\text{MSRP} \\times (1 - \\text{Discount}\\%)]$",
        "conceptBudget": {
          "primaryConcept": "B2B Wholesale Invoicing Formula",
          "supportingTerms": [
            "MSRP ($100.00/unit)",
            "Distributor Tier Discount ($50.0\\% \\implies \\$50.00$ unit price)",
            "Units Ordered ($500$)",
            "Total Invoice = $500 \\times \\$50.00 = \\$25,000.00$",
            "Credit Terms: `NET_60_DAYS`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d23-b1-unboxing-roi-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "B2B Wholesale Trade Invoice (500 Units @ 50% Distributor Discount)",
              "boxes": [
                {
                  "label": "MSRP Retail Value",
                  "value": "500 Units x $100.00 MSRP = $50,000.00 Retail Value",
                  "varType": "MSRP",
                  "isUpdated": false
                },
                {
                  "label": "Distributor Tier Price",
                  "value": "50% Off MSRP = $50.00 Wholesale Unit Price",
                  "varType": "Unit Price",
                  "isUpdated": false
                },
                {
                  "label": "Total B2B Invoice Due",
                  "value": "500 x $50.00 = $25,000.00 (NET 60 DAYS PAYMENT TERMS)",
                  "varType": "Invoice Total",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "b2b_invoice_calc_demo.js",
            "initialCode": "function calculateB2bInvoice(msrp, units, discountPct, terms) {\n  const unitPrice = msrp * (1 - (discountPct / 100));\n  const total = unitPrice * units;\n  return {\n    msrp,\n    units,\n    unitPrice: Number(unitPrice.toFixed(2)),\n    totalInvoice: Number(total.toFixed(2)),\n    terms,\n    status: 'INVOICE_GENERATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateB2bInvoice(100, 500, 50, 'NET_60_DAYS')));",
            "expectedOutput": "{\"msrp\":100,\"units\":500,\"unitPrice\":50,\"totalInvoice\":25000,\"terms\":\"NET_60_DAYS\",\"status\":\"INVOICE_GENERATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total B2B invoice amount in dollars for 500 units of a $100 MSRP item discounted at 50% for an authorized wholesale distributor ($500 \\times 50$)?",
          "expectedStringOutput": "25000",
          "acceptableAnswers": [
            "25000",
            "$25,000",
            "25,000",
            "totalInvoice\":25000"
          ],
          "primaryMisconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
          "diagnosisMap": {
            "50000": {
              "misconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
              "errorExplanation": "50,000 is retail MSRP. B2B distributors get 50% off ($25,000 invoice).",
              "recoveryPath": {
                "simplerExplanation": "500 * 50 = 25,000.",
                "guidedFixPrompt": "Type 25000"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d24-b2-corporate-purchase-orders-po",
        "day": 24,
        "blockNumber": 2,
        "title": "Purchase Orders (PO), Request for Quote (RFQ) & Credit Limits",
        "conceptBudget": {
          "primaryConcept": "Corporate PO & Credit Control",
          "supportingTerms": [
            "Purchase Order (PO Number mandatory on B2B invoices)",
            "Corporate Credit Limit ($100k credit line: blocks new orders if overdue >30 days)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d24-b1-b2b-tiered-pricing-invoicing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "B2B Credit Control Rule",
            "codeSnippet": "// Corporate Credit Limit: $100,000\n// Outstanding Invoices:   $80,000\n// New Order Request:      $15,000 -> APPROVED ($80k + $15k = $95k <= $100k credit line!)\n// If New Order = $25,000 -> REJECTED: EXCEEDS_CREDIT_LIMIT",
            "lineNotes": {
              "1": "Credit ceiling.",
              "3": "Approved transaction.",
              "4": "Credit breach prevention."
            }
          },
          {
            "type": "runnable_code",
            "filename": "credit_limit_demo.js",
            "initialCode": "function evaluateCreditApproval(creditLimit, currentDebt, orderValue) {\n  return (currentDebt + orderValue) <= creditLimit\n    ? 'APPROVE_B2B_PURCHASE_ORDER'\n    : 'HOLD_ORDER_EXCEEDS_CORPORATE_CREDIT_LINE';\n}\n\nconsole.log(evaluateCreditApproval(100000, 80000, 15000));\nconsole.log(evaluateCreditApproval(100000, 80000, 25000));",
            "expectedOutput": "APPROVE_B2B_PURCHASE_ORDER\nHOLD_ORDER_EXCEEDS_CORPORATE_CREDIT_LINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when a corporate customer with an $80k debt requests a $15k PO within their $100k credit limit?",
          "expectedStringOutput": "APPROVE_B2B_PURCHASE_ORDER",
          "acceptableAnswers": [
            "APPROVE_B2B_PURCHASE_ORDER",
            "Approve PO",
            "Approved"
          ],
          "primaryMisconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
          "diagnosisMap": {
            "HOLD": {
              "misconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
              "errorExplanation": "80k + 15k = 95k, which is <= 100k. The purchase order is approved.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPROVE_B2B_PURCHASE_ORDER.",
                "guidedFixPrompt": "Type APPROVE_B2B_PURCHASE_ORDER"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d24-b3-quick-order-csv-bulk-upload",
        "day": 24,
        "blockNumber": 3,
        "title": "B2B Quick Order: CSV Bulk Upload & SKU Quantity Grid",
        "conceptBudget": {
          "primaryConcept": "B2B Quick Order UX",
          "supportingTerms": [
            "Procurement managers upload a 500-line CSV file with SKU + Quantity to place order in 10 seconds",
            "Eliminates browsing hundreds of individual PDP pages"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d24-b2-corporate-purchase-orders-po",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quick_order_demo.js",
            "initialCode": "function getB2bOrderingFeature() {\n  return 'BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL';\n}\n\nconsole.log(getB2bOrderingFeature());",
            "expectedOutput": "BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What B2B portal feature enables enterprise procurement officers to submit bulk orders containing hundreds of SKUs simultaneously in seconds?",
          "expectedStringOutput": "BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL",
          "acceptableAnswers": [
            "BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL",
            "CSV Upload",
            "Bulk CSV Upload"
          ],
          "primaryMisconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
          "diagnosisMap": {
            "CART": {
              "misconceptionId": "MC_ECOM_B2B_COMMERCE_NET30_PURCHASE_ORDERS",
              "errorExplanation": "Clicking add-to-cart on 500 pages is impossible for procurement teams. They use BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL.",
                "guidedFixPrompt": "Type BULK_CSV_SKU_QUANTITY_UPLOAD_PORTAL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Dropshipping & Print-on-Demand (POD): Supplier SLAs & Margin Squeezes",
    "overviewMetaphor": "Dropshipping is Running a Virtual Storefront While a Third-Party Factory Ships the Box: You sell an item for $50.00; the supplier charges $20.00 for the product plus $8.00 for shipping ($28.00 total cost), leaving you with a $22.00 net profit (44.0% gross margin); enforcing strict supplier contracts guaranteeing a 24-hour dispatch SLA prevents customer chargebacks and delays.",
    "blocks": [
      {
        "id": "ecom-d25-b1-dropshipping-margin-sla-calculation",
        "day": 25,
        "blockNumber": 1,
        "title": "Dropshipping Unit Economics: $\\text{Gross Margin} = \\frac{\\text{Price} - (\\text{Supplier} + \\text{Shipping})}{\\text{Price}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Dropshipping Profit Formula",
          "supportingTerms": [
            "Retail Price ($50.00)",
            "Supplier Item Cost ($20.00) + Freight Shipping ($8.00) = $28.00 Cost",
            "Net Profit = $50.00 - 28.00 = \\$22.00$",
            "Gross Margin = $\\frac{22}{50} \\times 100\\% = 44.0\\%$",
            "Supplier Dispatch SLA: $\\le 24$ hours"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d24-b1-b2b-tiered-pricing-invoicing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Dropshipping Order Economics ($50 Retail, $20 Supplier, $8 Freight)",
              "boxes": [
                {
                  "label": "Customer Payment",
                  "value": "$50.00 Collected from Customer Checkout",
                  "varType": "Revenue",
                  "isUpdated": false
                },
                {
                  "label": "Supplier COGS & Shipping",
                  "value": "$20.00 Product + $8.00 Freight = $28.00 Paid to Supplier",
                  "varType": "Cost",
                  "isUpdated": false
                },
                {
                  "label": "Net Dropship Profit",
                  "value": "$50.00 - $28.00 = $22.00 (44.00% GROSS PROFIT MARGIN!)",
                  "varType": "Profit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dropship_calc_demo.js",
            "initialCode": "function calculateDropshipProfit(price, supplierCost, shippingFee, dispatchHours) {\n  const totalCost = supplierCost + shippingFee;\n  const profit = price - totalCost;\n  const margin = (profit / price) * 100;\n  return {\n    profit,\n    marginPercent: Number(margin.toFixed(2)),\n    meetsSla: dispatchHours <= 24,\n    status: 'DROPSHIP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDropshipProfit(50, 20, 8, 18)));",
            "expectedOutput": "{\"profit\":22,\"marginPercent\":44,\"meetsSla\":true,\"status\":\"DROPSHIP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net profit in dollars from a $50 dropshipped order with $20 supplier product cost and $8 shipping ($50 - (20 + 8)$)?",
          "expectedStringOutput": "22",
          "acceptableAnswers": [
            "22",
            "$22",
            "22.0",
            "profit\":22"
          ],
          "primaryMisconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
              "errorExplanation": "30 forgets the $8 shipping cost (50 - 20). Total cost is 28, leaving $22 net profit.",
              "recoveryPath": {
                "simplerExplanation": "50 - 28 = 22.",
                "guidedFixPrompt": "Type 22"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d25-b2-blind-shipping-supplier-neutrality",
        "day": 25,
        "blockNumber": 2,
        "title": "Blind Shipping Invariant: Omitting Factory Branding on Packing Slips",
        "conceptBudget": {
          "primaryConcept": "Blind Shipping Standard",
          "supportingTerms": [
            "Blind Shipping (Supplier uses plain boxes and merchant-branded packing slips with 0 factory marketing)",
            "Protects brand equity and prevents customers from buying direct from the manufacturer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d25-b1-dropshipping-margin-sla-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Blind Shipping Rules",
            "codeSnippet": "// ✅ BLIND SHIPPING: Plain brown box + Merchant logo packing slip + Merchant return address\n// ❌ FLAWED:          Supplier includes their own wholesale catalogue & pricing -> CUSTOMER LOST!",
            "lineNotes": {
              "1": "Professional white-label shipping.",
              "2": "Disastrous brand breach."
            }
          },
          {
            "type": "runnable_code",
            "filename": "blind_ship_demo.js",
            "initialCode": "function getBlindShippingStandard() {\n  return 'BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING';\n}\n\nconsole.log(getBlindShippingStandard());",
            "expectedOutput": "BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What packaging requirement ensures dropship suppliers omit their own logos and wholesale pricing from customer packages?",
          "expectedStringOutput": "BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING",
          "acceptableAnswers": [
            "BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING",
            "Blind Shipping",
            "Blind shipping"
          ],
          "primaryMisconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
              "errorExplanation": "Standard shipping exposes factory branding. Dropshipping requires BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING.",
                "guidedFixPrompt": "Type BLIND_SHIPPING_OMITS_SUPPLIER_BRANDING"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d25-b3-print-on-demand-pod-workflows",
        "day": 25,
        "blockNumber": 3,
        "title": "Print-on-Demand (POD): Automated Direct-to-Garment (DTG) Production",
        "conceptBudget": {
          "primaryConcept": "Print-on-Demand Architecture",
          "supportingTerms": [
            "Customer orders custom design shirt $\\to$ Webhook automatically triggers DTG printing at fulfillment facility in $<4$ hours $\\to$ Zero upfront inventory risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d25-b2-blind-shipping-supplier-neutrality",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pod_demo.js",
            "initialCode": "function getPodCoreAdvantage() {\n  return 'ZERO_UPFRONT_INVENTORY_CAPITAL_RISK';\n}\n\nconsole.log(getPodCoreAdvantage());",
            "expectedOutput": "ZERO_UPFRONT_INVENTORY_CAPITAL_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What primary business advantage makes Print-on-Demand (POD) attractive for testing new apparel graphic designs?",
          "expectedStringOutput": "ZERO_UPFRONT_INVENTORY_CAPITAL_RISK",
          "acceptableAnswers": [
            "ZERO_UPFRONT_INVENTORY_CAPITAL_RISK",
            "Zero inventory risk",
            "Zero upfront capital"
          ],
          "primaryMisconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
          "diagnosisMap": {
            "CHEAP": {
              "misconceptionId": "MC_ECOM_DROPSHIPPING_SUPPLIER_SLA_MARGINS",
              "errorExplanation": "POD unit cost is higher, but it carries ZERO_UPFRONT_INVENTORY_CAPITAL_RISK.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_UPFRONT_INVENTORY_CAPITAL_RISK.",
                "guidedFixPrompt": "Type ZERO_UPFRONT_INVENTORY_CAPITAL_RISK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "E-Commerce Recommendation Engines: Cross-Sells & Frequently Bought Together",
    "overviewMetaphor": "A Recommendation Engine is a Grocery Store Merchandiser Placing Salsa and Tortilla Chips on the Same Shelf: If baseline Average Order Value is $100.00 and you introduce a 1-Click 'Frequently Bought Together' bundle priced at $40.00 that achieves a 25.0% attach rate, every order adds an incremental $10.00 on average ($40 \\times 0.25$), elevating the blended AOV to $110.00 (+10.0% revenue lift) with zero extra marketing spend.",
    "blocks": [
      {
        "id": "ecom-d26-b1-recommendation-aov-lift-calculation",
        "day": 26,
        "blockNumber": 1,
        "title": "Recommendation AOV Lift: $\\text{New AOV} = \\text{Base AOV} + (\\text{Bundle Price} \\times \\text{Attach Rate}\\%)$",
        "conceptBudget": {
          "primaryConcept": "AOV Lift Formula",
          "supportingTerms": [
            "Baseline AOV ($100.00$)",
            "Bundle Cross-Sell Price ($40.00$)",
            "Attach Rate ($25.0\\% \\implies +\\$10.00$ incremental AOV)",
            "New Blended AOV = $100.00 + 10.00 = \\$110.00$",
            "AOV Lift = $+10.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d25-b1-dropshipping-margin-sla-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Recommendation Cross-Sell AOV Impact ($100 Base AOV, $40 Bundle @ 25% Attach)",
              "boxes": [
                {
                  "label": "Baseline Order Value",
                  "value": "$100.00 Average Order Value before recommendations",
                  "varType": "Base AOV",
                  "isUpdated": false
                },
                {
                  "label": "Incremental Bundle Value",
                  "value": "$40.00 Bundle x 25.0% Attach Rate = +$10.00/order",
                  "varType": "Cross-Sell",
                  "isUpdated": false
                },
                {
                  "label": "New Blended AOV",
                  "value": "$100.00 + $10.00 = $110.00 (+10.00% TOTAL REVENUE LIFT!)",
                  "varType": "New AOV",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aov_lift_calc_demo.js",
            "initialCode": "function calculateAovLift(baseAov, bundlePrice, attachPct) {\n  const inc = bundlePrice * (attachPct / 100);\n  const newAov = baseAov + inc;\n  const lift = (inc / baseAov) * 100;\n  return {\n    baseAov,\n    newAov: Number(newAov.toFixed(2)),\n    aovLiftPercent: Number(lift.toFixed(2)),\n    status: 'AOV_LIFT_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAovLift(100, 40, 25)));",
            "expectedOutput": "{\"baseAov\":100,\"newAov\":110,\"aovLiftPercent\":10,\"status\":\"AOV_LIFT_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the new blended Average Order Value (AOV) in dollars when a $100 baseline AOV store adds a $40 bundle cross-sell with a 25% attach rate ($100 + (40 \\times 0.25)$)?",
          "expectedStringOutput": "110",
          "acceptableAnswers": [
            "110",
            "$110",
            "110.0",
            "newAov\":110"
          ],
          "primaryMisconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
          "diagnosisMap": {
            "140": {
              "misconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
              "errorExplanation": "140 assumes 100% attach rate. With 25% attach rate, incremental AOV is $10 -> $110 total AOV.",
              "recoveryPath": {
                "simplerExplanation": "100 + (40 * 0.25) = 110.",
                "guidedFixPrompt": "Type 110"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d26-b2-collaborative-vs-content-filtering",
        "day": 26,
        "blockNumber": 2,
        "title": "Collaborative Filtering vs Content-Based Product Embeddings",
        "conceptBudget": {
          "primaryConcept": "Recommendation Algorithms",
          "supportingTerms": [
            "Collaborative Filtering ('Users who bought item X also bought item Y')",
            "Content-Based Filtering (Vector embeddings matching item attributes: color, fabric, category)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d26-b1-recommendation-aov-lift-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Recommendation Algorithm Comparison",
            "codeSnippet": "// COLLABORATIVE FILTERING: User Co-occurrence Matrix (Best for mature stores with 100k+ orders)\n// CONTENT-BASED FILTERING: Vector Embeddings (Best for new cold-start product launches with 0 history)",
            "lineNotes": {
              "1": "Behavioral pattern matching.",
              "2": "Attribute similarity for cold-start."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rec_algo_demo.js",
            "initialCode": "function selectRecommendationAlgorithm(isColdStartNewItem) {\n  return isColdStartNewItem\n    ? 'CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING'\n    : 'COLLABORATIVE_USER_BEHAVIOR_FILTERING';\n}\n\nconsole.log(selectRecommendationAlgorithm(true));\nconsole.log(selectRecommendationAlgorithm(false));",
            "expectedOutput": "CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING\nCOLLABORATIVE_USER_BEHAVIOR_FILTERING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which recommendation algorithm is selected for a brand new product launch with zero historical purchase data to overcome the cold-start problem?",
          "expectedStringOutput": "CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING",
          "acceptableAnswers": [
            "CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING",
            "Content-based",
            "Content based filtering"
          ],
          "primaryMisconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
          "diagnosisMap": {
            "COLLABORATIVE": {
              "misconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
              "errorExplanation": "Collaborative filtering fails on new items with 0 orders. Content-based matching solves the cold start.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING.",
                "guidedFixPrompt": "Type CONTENT_BASED_ATTRIBUTE_VECTOR_MATCHING"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d26-b3-post-purchase-one-click-upsell",
        "day": 26,
        "blockNumber": 3,
        "title": "Post-Purchase 1-Click Upsells: Zero-Friction Order Value Expansion",
        "conceptBudget": {
          "primaryConcept": "Post-Purchase Upsell Architecture",
          "supportingTerms": [
            "Presented AFTER payment succeeds, BEFORE the thank-you page",
            "1-Click authorization modifies the existing authorized card transaction without re-entering payment info $\\implies 18\\%$ take rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d26-b2-collaborative-vs-content-filtering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "post_purchase_demo.js",
            "initialCode": "function getPostPurchaseAdvantage() {\n  return 'ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER';\n}\n\nconsole.log(getPostPurchaseAdvantage());",
            "expectedOutput": "ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do post-purchase 1-click upsells carry zero conversion risk to the initial customer checkout?",
          "expectedStringOutput": "ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER",
          "acceptableAnswers": [
            "ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER",
            "Zero risk to initial order",
            "Already paid"
          ],
          "primaryMisconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
          "diagnosisMap": {
            "RISKY": {
              "misconceptionId": "MC_ECOM_RECOMMENDATION_ENGINES_CROSS_SELL",
              "errorExplanation": "The initial order is already authorized and complete. The upsell simply modifies the total with zero drop-off risk.",
              "recoveryPath": {
                "simplerExplanation": "Matches ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER.",
                "guidedFixPrompt": "Type ONE_CLICK_PAYMENT_MODIFICATION_ZERO_RISK_TO_INITIAL_ORDER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "E-Commerce Taxation & Compliance: GST, TCS (1%) & E-Way Bills",
    "overviewMetaphor": "E-Commerce Tax Compliance is an Automated Digital Toll Booth for Government Revenue: Under Section 52 of the GST Act, e-commerce marketplaces (Amazon, Flipkart) are legally mandated to deduct 1.0% Tax Collected at Source (TCS) on all taxable sales ($100,000 sales $\\implies \\$1,000$ TCS deducted); after deducting the marketplace's 10% commission ($10,000), the net remittance deposited to the seller's bank account is exactly $89,000.00.",
    "blocks": [
      {
        "id": "ecom-d27-b1-gst-tcs-one-percent-calculation",
        "day": 27,
        "blockNumber": 1,
        "title": "Section 52 GST 1.0% TCS Deduction & Net Seller Remittance",
        "conceptBudget": {
          "primaryConcept": "Marketplace TCS Formula",
          "supportingTerms": [
            "Net Taxable Supplies ($100,000.00)",
            "Mandatory 1.0% GST TCS Deduction = $100,000 \\times 0.01 = \\$1,000.00$",
            "Marketplace Commission ($10.0\\% \\implies \\$10,000.00$)",
            "Net Remittance to Seller = $100,000 - 1,000 - 10,000 = \\$89,000.00$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d26-b1-recommendation-aov-lift-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Marketplace Statutory Settlement Ledger ($100k Net Supplies)",
              "boxes": [
                {
                  "label": "Net Taxable Supplies",
                  "value": "$100,000.00 Total Gross Marketplace Product Sales",
                  "varType": "Supplies",
                  "isUpdated": false
                },
                {
                  "label": "1% TCS & 10% Commission",
                  "value": "$1,000.00 (1% TCS to Govt) + $10,000.00 Platform Commission",
                  "varType": "Deductions",
                  "isUpdated": false
                },
                {
                  "label": "Net Seller Remittance",
                  "value": "$100,000 - $1,000 - $10,000 = $89,000.00 (DEPOSITED TO SELLER BANK!)",
                  "varType": "Remittance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tcs_calc_demo.js",
            "initialCode": "function calculateMarketplaceSettlement(supplies, commPct) {\n  const tcs = supplies * 0.01;\n  const comm = supplies * (commPct / 100);\n  const net = supplies - tcs - comm;\n  return {\n    supplies,\n    tcsDeduction: tcs,\n    commission: comm,\n    netRemittance: net,\n    status: 'TCS_SETTLED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMarketplaceSettlement(100000, 10)));",
            "expectedOutput": "{\"supplies\":100000,\"tcsDeduction\":1000,\"commission\":10000,\"netRemittance\":89000,\"status\":\"TCS_SETTLED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net dollar remittance paid to a seller from $100,000 in marketplace sales after deducting 1% GST TCS ($1,000) and 10% commission ($10,000) ($100,000 - 1,000 - 10,000$)?",
          "expectedStringOutput": "89000",
          "acceptableAnswers": [
            "89000",
            "$89,000",
            "89,000",
            "netRemittance\":89000"
          ],
          "primaryMisconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
          "diagnosisMap": {
            "90000": {
              "misconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
              "errorExplanation": "90,000 forgets the 1% TCS statutory deduction ($1,000). Net remittance is $89,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 - 1,000 - 10,000 = 89,000.",
                "guidedFixPrompt": "Type 89000"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d27-b2-eway-bills-interstate-goods-movement",
        "day": 27,
        "blockNumber": 2,
        "title": "E-Way Bills & Mandatory ₹50,000 Interstate Consignment Thresholds",
        "conceptBudget": {
          "primaryConcept": "E-Way Bill Statutory Threshold",
          "supportingTerms": [
            "Mandatory electronic document for consignment value $> \\text{₹50,000}$",
            "Contains Part A (Consignor/Consignee GSTIN & Invoice value) and Part B (Vehicle number / Transporter ID)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d27-b1-gst-tcs-one-percent-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "E-Way Bill Requirement Rule",
            "codeSnippet": "// Consignment Value > ₹50,000? -> MANDATORY_EWAY_BILL_GENERATION_REQUIRED\n// Consignment Value <= ₹50,000? -> EXEMPT_STANDARD_INVOICE_SUFFICIENT",
            "lineNotes": {
              "1": "Statutory threshold trigger.",
              "2": "Exempt threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eway_bill_demo.js",
            "initialCode": "function evaluateEwayRequirement(invoiceValueInr) {\n  return invoiceValueInr > 50000\n    ? 'MANDATORY_EWAY_BILL_GENERATION_REQUIRED'\n    : 'EXEMPT_STANDARD_INVOICE_SUFFICIENT';\n}\n\nconsole.log(evaluateEwayRequirement(75000));\nconsole.log(evaluateEwayRequirement(25000));",
            "expectedOutput": "MANDATORY_EWAY_BILL_GENERATION_REQUIRED\nEXEMPT_STANDARD_INVOICE_SUFFICIENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory compliance document is legally required for transporting an e-commerce consignment with an invoice value of ₹75,000 across state lines?",
          "expectedStringOutput": "MANDATORY_EWAY_BILL_GENERATION_REQUIRED",
          "acceptableAnswers": [
            "MANDATORY_EWAY_BILL_GENERATION_REQUIRED",
            "E-Way Bill",
            "Eway bill"
          ],
          "primaryMisconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
          "diagnosisMap": {
            "EXEMPT": {
              "misconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
              "errorExplanation": "₹75,000 exceeds the ₹50,000 threshold, making an E-Way Bill mandatory.",
              "recoveryPath": {
                "simplerExplanation": "Matches MANDATORY_EWAY_BILL_GENERATION_REQUIRED.",
                "guidedFixPrompt": "Type MANDATORY_EWAY_BILL_GENERATION_REQUIRED"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d27-b3-country-of-origin-mandates",
        "day": 27,
        "blockNumber": 3,
        "title": "Statutory Country of Origin (COO) Declarations on Product PDPs",
        "conceptBudget": {
          "primaryConcept": "Country of Origin Mandate",
          "supportingTerms": [
            "Consumer Protection (E-Commerce) Rules legally require displaying 'Country of Origin: India / China / Vietnam' prominently on every single PDP"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d27-b2-eway-bills-interstate-goods-movement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coo_demo.js",
            "initialCode": "function getCooStatutoryRule() {\n  return 'MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS';\n}\n\nconsole.log(getCooStatutoryRule());",
            "expectedOutput": "MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What legal labeling requirement is mandated on all e-commerce product pages under statutory consumer protection regulations?",
          "expectedStringOutput": "MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS",
          "acceptableAnswers": [
            "MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS",
            "Country of Origin",
            "Mandatory COO"
          ],
          "primaryMisconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
          "diagnosisMap": {
            "OPTIONAL": {
              "misconceptionId": "MC_ECOM_TAXATION_GST_TCS_EWAY_COMPLIANCE",
              "errorExplanation": "Country of Origin is legally mandatory on all digital commerce product detail pages.",
              "recoveryPath": {
                "simplerExplanation": "Matches MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS.",
                "guidedFixPrompt": "Type MANDATORY_COUNTRY_OF_ORIGIN_ON_ALL_ECOM_PDPS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Financial Auditing: Payment Gateway & 3PL Freight Invoice Reconciliation",
    "overviewMetaphor": "Freight Reconciliation is a Detective Auditing Courier Overbilling: Couriers frequently miscalculate package dimensions, billing an actual 3.5 kg box as 5.0 kg (1.5 kg overcharge); with shipping rates at $20.00/kg, automated invoice auditing identifies the 1.5 kg discrepancy ($5.0 - 3.5$) and automatically files a $30.00 refund dispute claim ($1.5 \\times \\$20$), recovering 8% of annual shipping spend.",
    "blocks": [
      {
        "id": "ecom-d28-b1-freight-overcharge-dispute-calculation",
        "day": 28,
        "blockNumber": 1,
        "title": "3PL Courier Weight Discrepancy & Dispute Recovery: $\\text{Refund} = (\\text{Billed} - \\text{Actual}) \\times \\text{Rate/kg}$",
        "conceptBudget": {
          "primaryConcept": "Freight Overcharge Recovery Formula",
          "supportingTerms": [
            "Billed Weight ($5.0$ kg)",
            "Actual Warehouse Scanned Weight ($3.5$ kg)",
            "Weight Discrepancy = $5.0 - 3.5 = 1.5$ kg",
            "Freight Rate = $20.00/kg",
            "Refund Claim Dollars = $1.5 \\times \\$20.00 = \\$30.00$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d27-b1-gst-tcs-one-percent-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3PL Freight Audit Ledger (Billed 5.0 kg vs Actual 3.5 kg @ $20/kg)",
              "boxes": [
                {
                  "label": "Courier Billed Invoice",
                  "value": "5.00 kg Charged on Courier Monthly Invoice",
                  "varType": "Billed",
                  "isUpdated": false
                },
                {
                  "label": "Warehouse Verified Weight",
                  "value": "3.50 kg Actual Barcode Scale Scan at Packing Station",
                  "varType": "Actual",
                  "isUpdated": false
                },
                {
                  "label": "Automated Dispute Refund",
                  "value": "1.50 kg x $20.00/kg = $30.00 DISPUTE REFUND RECOVERED!",
                  "varType": "Refund",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "freight_audit_calc_demo.js",
            "initialCode": "function auditFreight(billedKg, actualKg, ratePerKg) {\n  const diff = Math.max(0, billedKg - actualKg);\n  const claim = diff * ratePerKg;\n  return {\n    billedKg,\n    actualKg,\n    discrepancyKg: Number(diff.toFixed(2)),\n    refundClaimDollars: Number(claim.toFixed(2)),\n    status: 'FREIGHT_OVERCHARGE_DISPUTE_CLAIM_FILED'\n  };\n}\n\nconsole.log(JSON.stringify(auditFreight(5.0, 3.5, 20)));",
            "expectedOutput": "{\"billedKg\":5,\"actualKg\":3.5,\"discrepancyKg\":1.5,\"refundClaimDollars\":30,\"status\":\"FREIGHT_OVERCHARGE_DISPUTE_CLAIM_FILED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars of freight refund dispute claim are recovered when a courier bills 5.0 kg for a package that actually weighs 3.5 kg with a $20/kg rate ($ (5.0 - 3.5) \\times 20 $)?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "$30",
            "30.0",
            "refundClaimDollars\":30"
          ],
          "primaryMisconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
              "errorExplanation": "100 is total billed freight (5 * 20). The recovered overcharge is (5 - 3.5) * 20 = $30.00.",
              "recoveryPath": {
                "simplerExplanation": "1.5 * 20 = 30.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d28-b2-bank-settlement-t2-reconciliation",
        "day": 28,
        "blockNumber": 2,
        "title": "T+2 Bank Settlement File vs Order ID 3-Way Reconciliation",
        "conceptBudget": {
          "primaryConcept": "3-Way Payment Reconciliation",
          "supportingTerms": [
            "Matching Order ID in OMS against Gateway Transaction ID and Bank Settlement UTR reference",
            "Identifies missing or stuck payouts across T+2 settlement windows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d28-b1-freight-overcharge-dispute-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3-Way Match Invariant",
            "codeSnippet": "// 1. OMS Order Record:       Order #7890 for $1,000.00\n// 2. Gateway Settlement Log:  Trans #TXN_456 settled $979.70 (MDR deducted)\n// 3. Bank Statement Credit:   UTR #123456 received $979.70 -> STATUS: 100% RECONCILED!",
            "lineNotes": {
              "1": "Internal order record.",
              "2": "Processor settlement record.",
              "3": "Bank cash credit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bank_recon_demo.js",
            "initialCode": "function evaluateThreeWayMatch(omsTotal, gatewayNet, bankReceived) {\n  return (gatewayNet === bankReceived)\n    ? 'THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT'\n    : 'DISCREPANCY_FLAGGED_MISSING_FUNDS';\n}\n\nconsole.log(evaluateThreeWayMatch(1000, 979.70, 979.70));",
            "expectedOutput": "THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What reconciliation status is confirmed when the payment gateway net settlement matches the bank statement credited cash amount 100%?",
          "expectedStringOutput": "THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT",
          "acceptableAnswers": [
            "THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT",
            "Verified 100%",
            "Reconciled"
          ],
          "primaryMisconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
          "diagnosisMap": {
            "DISCREPANCY": {
              "misconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
              "errorExplanation": "When gateway net matches bank received, the 3-way match is 100% verified.",
              "recoveryPath": {
                "simplerExplanation": "Matches THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT.",
                "guidedFixPrompt": "Type THREE_WAY_PAYMENT_RECONCILIATION_VERIFIED_100_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d28-b3-automated-dispute-webhook-triggers",
        "day": 28,
        "blockNumber": 3,
        "title": "Automated Dispute Filing via Logistics Partner APIs",
        "conceptBudget": {
          "primaryConcept": "Automated Freight Dispute APIs",
          "supportingTerms": [
            "Auditor script detects weight discrepancy $\\to$ Fires HTTP POST to carrier dispute API with scale image attachment $\\to$ Credits merchant account in 48 hours"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d28-b2-bank-settlement-t2-reconciliation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "api_dispute_demo.js",
            "initialCode": "function getDisputeApiWorkflow() {\n  return 'AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED';\n}\n\nconsole.log(getDisputeApiWorkflow());",
            "expectedOutput": "AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are freight weight dispute claims submitted at scale across thousands of monthly carrier shipments?",
          "expectedStringOutput": "AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED",
          "acceptableAnswers": [
            "AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED",
            "Automated API",
            "API Dispute Filing"
          ],
          "primaryMisconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
          "diagnosisMap": {
            "MANUAL": {
              "misconceptionId": "MC_ECOM_FINANCIAL_SETTLEMENT_RECONCILIATION",
              "errorExplanation": "Manual claims take too long. Modern systems use AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED.",
                "guidedFixPrompt": "Type AUTOMATED_API_DISPUTE_FILING_WITH_WEIGHT_PROOF_ATTACHED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Autonomous AI Commerce: Dynamic Personalization & Predictive Inventory",
    "overviewMetaphor": "Autonomous AI Commerce is an Intelligent Digital Store Manager Operating at Machine Speed: An autonomous AI engine achieves an elite 78.0 Operational Efficiency Score by combining three pillars: 1. Deflecting 70% of customer support tickets via automated tracking bots ($70 \\times 0.40 = 28.0$); 2. Generating a 15% personalized AOV lift ($15 \\times 2.0 = 30.0$); 3. Reducing out-of-stock events by 50% via predictive supply chain forecasting ($50 \\times 0.40 = 20.0$), elevating store performance to Tier-1 Autonomous status.",
    "blocks": [
      {
        "id": "ecom-d29-b1-ai-commerce-efficiency-score",
        "day": 29,
        "blockNumber": 1,
        "title": "AI Operational Efficiency Score: $\\text{Score} = (\\text{Deflection}\\% \\times 0.40) + (\\text{AOV Lift}\\% \\times 2.0) + (\\text{Stockout Red}\\% \\times 0.40)$",
        "conceptBudget": {
          "primaryConcept": "AI Commerce Efficiency Formula",
          "supportingTerms": [
            "Ticket Deflection ($70.0\\% \\implies 28.0$ pts)",
            "Personalized AOV Lift ($15.0\\% \\implies 30.0$ pts)",
            "Stockout Reduction ($50.0\\% \\implies 20.0$ pts)",
            "Total AI Efficiency Score = $28.0 + 30.0 + 20.0 = 78.0$ pts",
            "Tier-1 Autonomous Standard: $\\ge 65.0$ pts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d28-b1-freight-overcharge-dispute-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AI Commerce Operational Efficiency Scorecard (78.0 Composite Score)",
              "boxes": [
                {
                  "label": "1. Autonomous Deflection",
                  "value": "70% Ticket Deflection x 0.40 = 28.00 Points",
                  "varType": "Support",
                  "isUpdated": false
                },
                {
                  "label": "2. Personalization Lift",
                  "value": "15% AOV Lift x 2.0 = 30.00 Points",
                  "varType": "AOV",
                  "isUpdated": false
                },
                {
                  "label": "3. Total AI Efficiency",
                  "value": "28.0 + 30.0 + 20.0 = 78.00 (TIER-1 AUTONOMOUS AI COMMERCE ACTIVE!)",
                  "varType": "Efficiency",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ai_efficiency_calc_demo.js",
            "initialCode": "function calculateAiEfficiency(ticketsPct, aovLiftPct, stockoutRedPct) {\n  const score = (ticketsPct * 0.40) + (aovLiftPct * 2.0) + (stockoutRedPct * 0.40);\n  return {\n    ticketPoints: ticketsPct * 0.40,\n    aovPoints: aovLiftPct * 2.0,\n    stockoutPoints: stockoutRedPct * 0.40,\n    totalScore: Number(score.toFixed(1)),\n    isElite: score >= 65.0,\n    status: 'TIER_1_AUTONOMOUS_AI_COMMERCE_ACTIVE'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAiEfficiency(70, 15, 50)));",
            "expectedOutput": "{\"ticketPoints\":28,\"aovPoints\":30,\"stockoutPoints\":20,\"totalScore\":78,\"isElite\":true,\"status\":\"TIER_1_AUTONOMOUS_AI_COMMERCE_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the composite AI Operational Efficiency Score when ticket deflection is 70%, personalized AOV lift is 15%, and stockout reduction is 50% ($ 28 + 30 + 20 $)?",
          "expectedStringOutput": "78",
          "acceptableAnswers": [
            "78",
            "78.0",
            "totalScore\":78"
          ],
          "primaryMisconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
          "diagnosisMap": {
            "135": {
              "misconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
              "errorExplanation": "135 is raw unweighted sum (70 + 15 + 50). Weighted score is (70*0.4)+(15*2)+(50*0.4) = 78.0.",
              "recoveryPath": {
                "simplerExplanation": "28 + 30 + 20 = 78.",
                "guidedFixPrompt": "Type 78"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d29-b2-real-time-dynamic-merchandising",
        "day": 29,
        "blockNumber": 2,
        "title": "Real-Time Dynamic Merchandising & User Intent Category Sorting",
        "conceptBudget": {
          "primaryConcept": "Dynamic Merchandising Personalization",
          "supportingTerms": [
            "User browsing history shows interest in outdoor running shoes $\\to$ Storefront instantly re-ranks homepage category grid to display trail running gear at the top"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d29-b1-ai-commerce-efficiency-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dynamic Merchandising Rules",
            "codeSnippet": "// User Segment: 'Marathon Runner' (Viewed 3 running shoe pages)\n// -> Category Page Re-sorting: Boosts running hydration vests and GPS watches by +40 rank\n// -> Conversion Uplift: +28% higher category page add-to-cart rate!",
            "lineNotes": {
              "1": "Intent detection.",
              "2": "Dynamic boosting.",
              "3": "Conversion outcome."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dynamic_merch_demo.js",
            "initialCode": "function evaluateDynamicSorting(userIntent) {\n  return userIntent === 'RUNNING'\n    ? 'BOOST_RUNNING_COLLECTION_TO_POSITION_ONE'\n    : 'DISPLAY_DEFAULT_POPULARITY_RANKING';\n}\n\nconsole.log(evaluateDynamicSorting('RUNNING'));",
            "expectedOutput": "BOOST_RUNNING_COLLECTION_TO_POSITION_ONE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dynamic merchandising action is executed when an active shopper's intent signal indicates high interest in running apparel?",
          "expectedStringOutput": "BOOST_RUNNING_COLLECTION_TO_POSITION_ONE",
          "acceptableAnswers": [
            "BOOST_RUNNING_COLLECTION_TO_POSITION_ONE",
            "Boost Running",
            "Boost running collection"
          ],
          "primaryMisconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
          "diagnosisMap": {
            "DEFAULT": {
              "misconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
              "errorExplanation": "Static defaults miss personal intent. It triggers BOOST_RUNNING_COLLECTION_TO_POSITION_ONE.",
              "recoveryPath": {
                "simplerExplanation": "Matches BOOST_RUNNING_COLLECTION_TO_POSITION_ONE.",
                "guidedFixPrompt": "Type BOOST_RUNNING_COLLECTION_TO_POSITION_ONE"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d29-b3-ai-predictive-procurement",
        "day": 29,
        "blockNumber": 3,
        "title": "AI Predictive Procurement: Forecasting Seasonal Demand & Weather Correlations",
        "conceptBudget": {
          "primaryConcept": "AI Supply Chain Forecasting",
          "supportingTerms": [
            "Machine learning models ingesting weather forecasts, social media trend virality, and historical sales to pre-order inventory 3 weeks before demand spikes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d29-b2-real-time-dynamic-merchandising",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "predictive_procure_demo.js",
            "initialCode": "function getAiProcurementModel() {\n  return 'PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION';\n}\n\nconsole.log(getAiProcurementModel());",
            "expectedOutput": "PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What predictive intelligence model enables autonomous e-commerce supply chains to pre-order seasonal umbrellas and winter coats before demand spikes?",
          "expectedStringOutput": "PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION",
          "acceptableAnswers": [
            "PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION",
            "Predictive Forecasting",
            "Demand Forecasting"
          ],
          "primaryMisconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
          "diagnosisMap": {
            "REACTIVE": {
              "misconceptionId": "MC_ECOM_PERSONALIZATION_DYNAMIC_MERCHANDISING",
              "errorExplanation": "Reactive reordering causes stockouts during spikes. AI uses PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION.",
                "guidedFixPrompt": "Type PREDICTIVE_DEMAND_FORECASTING_WITH_WEATHER_CORRELATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign enterprise digital business and omnichannel e-commerce operating system: 1. Catalog Merchandising ($75.0\\%$ D2C gross margin, 12-SKU variant matrix, $E_d = -2.50$ elasticity, and sticky buy box); 2. Supply Chain & OMS ($979.70 net payment settlement, 6-stage lifecycle state machine, $ROP = 650$ units, $12.0$ kg volumetric freight, and $94.5$ Amazon Buy Box score); 3. Financials & Global Operations ($22.22\\%$ CM3 waterfall margin, $32.0\\%$ cohort RPR, $0.250\\%$ chargeback compliance, 2-hour BOPIS pickup, and $158.40 DDP landed cost); 4. Modern Business Models ($147,000 baseline MRR, $25,000 B2B wholesale trade invoice, and $110.00 recommendation AOV lift); 5. Compliance & AI Systems ($89,000 GST TCS net remittance, $30.00 freight dispute recovery, and 78.0 AI operational efficiency composite).",
    "blocks": [
      {
        "id": "ecom-d30-b1-enterprise-ecommerce-suite-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Omnichannel E-Commerce Master Suite Synthesis",
        "conceptBudget": {
          "primaryConcept": "Enterprise E-Commerce Master Suite Orchestration",
          "supportingTerms": [
            "Catalog & Merchandising Kernel",
            "Operations & Supply Chain Master",
            "Financials & Global Master",
            "Subscription & B2B Master",
            "Compliance & AI Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d29-b1-ai-commerce-efficiency-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Final Capstone Enterprise E-Commerce Orchestrator Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Synthesizes Catalog, Pricing ($Ed = -2.50) & PDP UX",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Executes OMS FSM, ROP (650 units) & Buy Box (94.5 score)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Validates CM3 (22.22%), RPR (32%), BOPIS & DDP ($158.40)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces GST TCS (1%), 3PL freight audit ($30 refund) & AI systems",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Grants 100/100 Enterprise Omnichannel E-Commerce Certification!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ecommerce_master_suite_demo.js",
            "initialCode": "function orchestrateEnterpriseEcommerceSuite() {\n  return {\n    catalogModule: 'ONLINE_75_PERCENT_D2C_MARGIN_ACTIVE',\n    operationsModule: 'ONLINE_OMS_FSM_AND_ROP_ACTIVE',\n    financialsModule: 'ONLINE_CM3_WATERFALL_ACTIVE',\n    omnichannelModule: 'ONLINE_BOPIS_AND_DDP_ACTIVE',\n    complianceModule: 'ONLINE_GST_TCS_AND_RECON_ACTIVE',\n    aiModule: 'ONLINE_AI_COMMERCE_78_SCORE_ACTIVE',\n    suiteStatus: 'ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL'\n  };\n}\n\nconsole.log(orchestrateEnterpriseEcommerceSuite().suiteStatus);",
            "expectedOutput": "ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification status confirms complete operational synthesis of the Enterprise Omnichannel E-Commerce Master Suite?",
          "expectedStringOutput": "ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL",
            "suiteStatus: ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
              "errorExplanation": "Matches ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ENTERPRISE_ECOMMERCE_AND_DIGITAL_BUSINESS_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d30-b2-enterprise-suite-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise E-Commerce Suite Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Enterprise E-Commerce Invariant Verification",
          "supportingTerms": [
            "Catalog Invariant",
            "Operations Invariant",
            "Financials Invariant",
            "Omnichannel Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d30-b1-enterprise-ecommerce-suite-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ecommerce_audit_demo.js",
            "initialCode": "function auditEcommerceSuite(catValid, opsValid, finValid, omniValid, compValid) {\n  const passed = catValid && opsValid && finValid && omniValid && compValid;\n  return {\n    catalogVerified: catValid,\n    operationsVerified: opsValid,\n    financialsVerified: finValid,\n    omnichannelVerified: omniValid,\n    complianceVerified: compValid,\n    grade: passed ? 'ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditEcommerceSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"catalogVerified\":true,\"operationsVerified\":true,\"financialsVerified\":true,\"omnichannelVerified\":true,\"complianceVerified\":true,\"grade\":\"ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 5 enterprise e-commerce pillars pass 100% verification?",
          "expectedStringOutput": "ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT",
          "acceptableAnswers": [
            "ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT",
            "grade\":\"ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT\""
          ],
          "primaryMisconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
              "errorExplanation": "All checks passing awards ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT.",
                "guidedFixPrompt": "Type ENTERPRISE_ECOMMERCE_SUITE_AUDIT_PASSED_100_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "ecom-d30-b3-final-capstone-ecom-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Final Capstone Enterprise Omnichannel E-Commerce Certification",
        "conceptBudget": {
          "primaryConcept": "Final Capstone Certification",
          "supportingTerms": [
            "Enterprise E-Commerce Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ecom-d30-b2-enterprise-suite-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_ecom_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite [VERIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Final Capstone completion of the Enterprise Omnichannel E-Commerce & Digital Business Master Suite?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite [VERIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ECOM_CAPSTONE_ENTERPRISE_OMNICHANNEL_SUITE",
              "errorExplanation": "Matches capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Enterprise Omnichannel E-Commerce & Digital Business Master Suite [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];

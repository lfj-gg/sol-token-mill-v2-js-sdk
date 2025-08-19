/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/token_mill_v2.json`.
 */
export type TokenMillV2 = {
  address: "JoeGXemoPqPeGPEXA3Z3UbjoPoGqqfbg8PD58M7Rqj2";
  metadata: {
    name: "tokenMillV2";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "createConfig";
      discriminator: [201, 207, 243, 114, 75, 111, 47, 189];
      accounts: [
        {
          name: "tokenMillConfig";
          writable: true;
          signer: true;
        },
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "quoteTokenMint";
          type: "pubkey";
        },
        {
          name: "protocolFeeShare";
          type: "u32";
        },
        {
          name: "protocolFeeTokenAccount";
          type: "pubkey";
        },
        {
          name: "kotmFeeTokenAccount";
          type: "pubkey";
        },
        {
          name: "feeRecipientChangeCooldown";
          type: "u32";
        },
        {
          name: "marketSettings";
          type: {
            defined: {
              name: "marketSettingsInput";
            };
          };
        }
      ];
    },
    {
      name: "createMarket";
      discriminator: [103, 226, 97, 235, 200, 188, 251, 254];
      accounts: [
        {
          name: "tokenMillConfig";
        },
        {
          name: "market";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 97, 114, 107, 101, 116];
              },
              {
                kind: "account";
                path: "tokenMint0";
              }
            ];
          };
        },
        {
          name: "tokenMint0";
          writable: true;
          signer: true;
        },
        {
          name: "marketReserve0";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "market";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint0";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "token0Metadata";
          writable: true;
        },
        {
          name: "tokenMint1";
        },
        {
          name: "marketReserve1";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "market";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint1";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "creator";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "tokenMetadataProgram";
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "uri";
          type: "string";
        },
        {
          name: "swapAuthority";
          type: {
            option: "pubkey";
          };
        }
      ];
    },
    {
      name: "removeSwapAuthority";
      discriminator: [128, 249, 213, 153, 65, 171, 76, 171];
      accounts: [
        {
          name: "config";
          relations: ["market"];
        },
        {
          name: "market";
          writable: true;
        },
        {
          name: "newFeeReserve";
          optional: true;
        },
        {
          name: "creator";
          signer: true;
          relations: ["market"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "swap";
      discriminator: [248, 198, 158, 145, 225, 117, 135, 200];
      accounts: [
        {
          name: "config";
          relations: ["market"];
        },
        {
          name: "market";
          writable: true;
        },
        {
          name: "marketReserve0";
          writable: true;
        },
        {
          name: "userTokenAccount0";
          writable: true;
        },
        {
          name: "marketReserve1";
          writable: true;
        },
        {
          name: "userTokenAccount1";
          writable: true;
        },
        {
          name: "feeReserve";
          writable: true;
        },
        {
          name: "protocolFeeReserve";
          writable: true;
        },
        {
          name: "creatorFeePool";
          writable: true;
        },
        {
          name: "user";
          signer: true;
        },
        {
          name: "swapAuthority";
          signer: true;
          optional: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "swapParameters";
          type: {
            defined: {
              name: "swapParameters";
            };
          };
        }
      ];
      returns: {
        defined: {
          name: "swapResult";
        };
      };
    },
    {
      name: "swapWithPriceLimit";
      discriminator: [54, 23, 76, 40, 64, 202, 5, 69];
      accounts: [
        {
          name: "config";
          relations: ["market"];
        },
        {
          name: "market";
          writable: true;
        },
        {
          name: "marketReserve0";
          writable: true;
        },
        {
          name: "userTokenAccount0";
          writable: true;
        },
        {
          name: "marketReserve1";
          writable: true;
        },
        {
          name: "userTokenAccount1";
          writable: true;
        },
        {
          name: "feeReserve";
          writable: true;
        },
        {
          name: "protocolFeeReserve";
          writable: true;
        },
        {
          name: "creatorFeePool";
          writable: true;
        },
        {
          name: "user";
          signer: true;
        },
        {
          name: "swapAuthority";
          signer: true;
          optional: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "zeroForOne";
          type: "bool";
        },
        {
          name: "deltaAmount";
          type: "i64";
        },
        {
          name: "sqrtPriceLimitX96";
          type: "u128";
        }
      ];
      returns: {
        defined: {
          name: "swapResult";
        };
      };
    },
    {
      name: "transferConfigOwnership";
      discriminator: [53, 124, 67, 226, 108, 130, 19, 12];
      accounts: [
        {
          name: "tokenMillConfig";
          writable: true;
        },
        {
          name: "admin";
          signer: true;
          relations: ["tokenMillConfig"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "newAdmin";
          type: "pubkey";
        }
      ];
    },
    {
      name: "updateConfigSettings";
      discriminator: [222, 242, 103, 173, 124, 98, 180, 244];
      accounts: [
        {
          name: "tokenMillConfig";
          writable: true;
        },
        {
          name: "newProtocolFeeReserve";
        },
        {
          name: "newCreatorFeePool";
        },
        {
          name: "admin";
          signer: true;
          relations: ["tokenMillConfig"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "newProtocolFeeShare";
          type: "u32";
        },
        {
          name: "newFeeRecipientChangeCooldown";
          type: "u32";
        }
      ];
    },
    {
      name: "updateFeeReserve";
      discriminator: [129, 136, 189, 198, 155, 88, 145, 199];
      accounts: [
        {
          name: "config";
          relations: ["market"];
        },
        {
          name: "market";
          writable: true;
        },
        {
          name: "newFeeReserve";
          optional: true;
        },
        {
          name: "creator";
          signer: true;
          relations: ["market"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "updateMarketDefaults";
      discriminator: [38, 26, 191, 18, 30, 234, 178, 41];
      accounts: [
        {
          name: "tokenMillConfig";
          writable: true;
        },
        {
          name: "admin";
          signer: true;
          relations: ["tokenMillConfig"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "marketSettings";
          type: {
            defined: {
              name: "marketSettingsInput";
            };
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "market";
      discriminator: [219, 190, 213, 55, 0, 227, 198, 154];
    },
    {
      name: "tokenMillConfig";
      discriminator: [28, 200, 141, 206, 141, 183, 203, 16];
    }
  ];
  events: [
    {
      name: "configCreation";
      discriminator: [22, 226, 190, 234, 176, 24, 250, 11];
    },
    {
      name: "configDefaultMarketSettingsUpdate";
      discriminator: [86, 122, 72, 223, 93, 152, 224, 97];
    },
    {
      name: "configFeeSettingsUpdate";
      discriminator: [137, 142, 221, 54, 111, 184, 135, 2];
    },
    {
      name: "configOwnershipTransfer";
      discriminator: [244, 36, 50, 39, 145, 158, 100, 124];
    },
    {
      name: "feeReserveUpdate";
      discriminator: [114, 245, 136, 81, 246, 204, 133, 12];
    },
    {
      name: "marketCreation";
      discriminator: [77, 174, 149, 37, 77, 226, 133, 219];
    },
    {
      name: "marketSwapAuthorityRemoved";
      discriminator: [61, 11, 41, 211, 46, 134, 227, 249];
    },
    {
      name: "swap";
      discriminator: [81, 108, 227, 190, 205, 208, 10, 196];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "divisionByZero";
    },
    {
      code: 6001;
      name: "amountOverflow";
    },
    {
      code: 6002;
      name: "amountInOverflow";
    },
    {
      code: 6003;
      name: "amountOutOverflow";
    },
    {
      code: 6004;
      name: "liquidityOverflow0";
    },
    {
      code: 6005;
      name: "liquidityOverflow1";
    },
    {
      code: 6006;
      name: "priceOverflow";
    },
    {
      code: 6007;
      name: "feeAmountOverflow";
    },
    {
      code: 6008;
      name: "adminSignatureRequired";
    },
    {
      code: 6009;
      name: "creatorSignatureRequired";
    },
    {
      code: 6010;
      name: "authoritySignatureRequired";
    },
    {
      code: 6011;
      name: "feeRecipientUpdateOnCd";
    },
    {
      code: 6012;
      name: "swapAuthorityAlreadyRemoved";
    },
    {
      code: 6013;
      name: "invalidFeeReserve";
    },
    {
      code: 6014;
      name: "invalidFee";
    },
    {
      code: 6015;
      name: "invalidQuoteTokenMint";
    },
    {
      code: 6016;
      name: "invalidSqrtPriceLimit";
    },
    {
      code: 6017;
      name: "invalidSqrtPrices";
    },
    {
      code: 6018;
      name: "zeroDeltaAmount";
    },
    {
      code: 6019;
      name: "slippageExceeded";
    }
  ];
  types: [
    {
      name: "configCreation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "quoteTokenMint";
            type: "pubkey";
          },
          {
            name: "protocolFeeShare";
            type: "u32";
          },
          {
            name: "protocolFeeReserve";
            type: "pubkey";
          },
          {
            name: "creatorFeePool";
            type: "pubkey";
          },
          {
            name: "feeRecipientChangeCooldown";
            type: "u32";
          },
          {
            name: "marketSettings";
            type: {
              defined: {
                name: "marketSettingsInput";
              };
            };
          }
        ];
      };
    },
    {
      name: "configDefaultMarketSettingsUpdate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "newMarketSettings";
            type: {
              defined: {
                name: "marketSettingsInput";
              };
            };
          }
        ];
      };
    },
    {
      name: "configFeeSettingsUpdate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "newProtocolFeeReserve";
            type: "pubkey";
          },
          {
            name: "newProtocolFeeShare";
            type: "u32";
          },
          {
            name: "newCreatorFeePool";
            type: "pubkey";
          },
          {
            name: "newFeeRecipientChangeCooldown";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "configOwnershipTransfer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "newAdmin";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "feeReserveUpdate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "market";
            type: "pubkey";
          },
          {
            name: "newFeeReserve";
            type: {
              option: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "market";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "swapAuthority";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "tokenMint0";
            type: "pubkey";
          },
          {
            name: "tokenMint1";
            type: "pubkey";
          },
          {
            name: "reserve0";
            type: "pubkey";
          },
          {
            name: "reserve1";
            type: "pubkey";
          },
          {
            name: "feeReserve";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "feeReserveLastUpdate";
            type: "i64";
          },
          {
            name: "settings";
            type: {
              defined: {
                name: "marketSettings";
              };
            };
          },
          {
            name: "sqrtPriceX96";
            type: "u128";
          },
          {
            name: "bump";
            type: {
              array: ["u8", 1];
            };
          }
        ];
      };
    },
    {
      name: "marketCreation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "market";
            type: "pubkey";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "tokenMint0";
            type: "pubkey";
          },
          {
            name: "swapAuthority";
            type: {
              option: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "marketSettings";
      type: {
        kind: "struct";
        fields: [
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "sqrtPriceAX96";
            type: "u128";
          },
          {
            name: "sqrtPriceBX96";
            type: "u128";
          },
          {
            name: "liquidityA";
            type: "u128";
          },
          {
            name: "liquidityB";
            type: "u128";
          },
          {
            name: "fee";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "marketSettingsInput";
      type: {
        kind: "struct";
        fields: [
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "supplyAtGraduation";
            type: "u64";
          },
          {
            name: "sqrtPriceAX96";
            type: "u128";
          },
          {
            name: "sqrtPriceBX96";
            type: "u128";
          },
          {
            name: "fee";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "marketSwapAuthorityRemoved";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "market";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "swap";
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "market";
            type: "pubkey";
          },
          {
            name: "zeroForOne";
            type: "bool";
          },
          {
            name: "swapResult";
            type: {
              defined: {
                name: "swapResult";
              };
            };
          }
        ];
      };
    },
    {
      name: "swapParameters";
      type: {
        kind: "enum";
        variants: [
          {
            name: "buyExactIn";
            fields: ["u64", "u64"];
          },
          {
            name: "buyExactOut";
            fields: ["u64", "u64"];
          },
          {
            name: "sellExactIn";
            fields: ["u64", "u64"];
          },
          {
            name: "sellExactOut";
            fields: ["u64", "u64"];
          }
        ];
      };
    },
    {
      name: "swapResult";
      type: {
        kind: "struct";
        fields: [
          {
            name: "amountIn";
            type: "u64";
          },
          {
            name: "amountOut";
            type: "u64";
          },
          {
            name: "feeAmountTokenIn";
            type: "u64";
          },
          {
            name: "feeAmountToken1";
            type: "u64";
          },
          {
            name: "nextSqrtPrice";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "tokenMillConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "quoteTokenMint";
            type: "pubkey";
          },
          {
            name: "protocolFeeShare";
            docs: ["Fees are split between the protocol and the creator"];
            type: "u32";
          },
          {
            name: "protocolFeeReserve";
            type: "pubkey";
          },
          {
            name: "creatorFeePool";
            type: "pubkey";
          },
          {
            name: "feeRecipientChangeCooldown";
            type: "u32";
          },
          {
            name: "defaultMarketSettings";
            type: {
              defined: {
                name: "marketSettings";
              };
            };
          }
        ];
      };
    }
  ];
  constants: [
    {
      name: "marketPdaSeed";
      type: "string";
      value: '"market"';
    },
    {
      name: "token0Decimals";
      type: "u8";
      value: "6";
    }
  ];
};

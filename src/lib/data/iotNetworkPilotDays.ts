import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const IOT_NETWORK_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Wireless Communication Spectrum & Protocols for IoT",
    "overviewMetaphor": "RF Wireless Spectrum is like Sound Frequencies in a Concert Hall: Sub-GHz (868/915 MHz) is deep bass (The low-pitched bass notes travel miles down the street and pass easily through thick concrete walls, but you cannot transmit high-speed symphony solos through bass alone); 2.4 GHz (Wi-Fi/BLE) is a soprano flute (It delivers high-bandwidth music fast, but putting your hand over your ear or stepping behind a glass door stops the sound immediately).",
    "blocks": [
      {
        "id": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
        "day": 1,
        "blockNumber": 1,
        "title": "RF Spectrum Allocations: Sub-GHz vs 2.4 GHz Propagation",
        "conceptBudget": {
          "primaryConcept": "RF Spectrum Propagation Invariant",
          "supportingTerms": [
            "Sub-GHz (433/868/915 MHz: Long range, deep building penetration, low bandwidth)",
            "2.4 GHz ISM Band (Universal worldwide license-free, high bandwidth, heavy attenuation by water/walls)",
            "Friis Transmission Equation ($P_r \\propto 1/f^2$)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sub-GHz vs 2.4 GHz Physical Trade-offs",
              "boxes": [
                {
                  "label": "Sub-GHz (868 / 915 MHz)",
                  "value": "Range: 10 - 15 km | Penetration: High (Thick concrete/soil) | Data Rate: 0.3 - 50 kbps",
                  "varType": "Long Range LPWAN",
                  "isUpdated": false
                },
                {
                  "label": "2.4 GHz ISM Band",
                  "value": "Range: 10 - 100 m | Penetration: Low (Water/body absorption) | Data Rate: 1 - 54 Mbps",
                  "varType": "High Speed PAN/LAN",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spectrum_loss_demo.js",
            "initialCode": "function evaluateRfBand(frequencyMhz) {\n  return (frequencyMhz < 1000)\n    ? 'SUB_GHZ: SUPERIOR_FOLIAGE_AND_CONCRETE_PENETRATION'\n    : '2.4GHZ_ISM: HIGH_BANDWIDTH_LIMITED_OBSTACLE_PENETRATION';\n}\n\nconsole.log(evaluateRfBand(868));\nconsole.log(evaluateRfBand(2400));",
            "expectedOutput": "SUB_GHZ: SUPERIOR_FOLIAGE_AND_CONCRETE_PENETRATION\n2.4GHZ_ISM: HIGH_BANDWIDTH_LIMITED_OBSTACLE_PENETRATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What propagation characteristic is returned for an 868 MHz Sub-GHz transmission?",
          "expectedStringOutput": "SUB_GHZ: SUPERIOR_FOLIAGE_AND_CONCRETE_PENETRATION",
          "acceptableAnswers": [
            "SUB_GHZ: SUPERIOR_FOLIAGE_AND_CONCRETE_PENETRATION",
            "SUB_GHZ"
          ],
          "primaryMisconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
          "diagnosisMap": {
            "2.4GHZ": {
              "misconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
              "errorExplanation": "868 MHz is below 1 GHz, offering superior obstacle penetration.",
              "recoveryPath": {
                "simplerExplanation": "Sub-GHz penetrates buildings better.",
                "guidedFixPrompt": "Type SUB_GHZ: SUPERIOR_FOLIAGE_AND_CONCRETE_PENETRATION"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d1-b2-free-space-path-loss-formula",
        "day": 1,
        "blockNumber": 2,
        "title": "Free Space Path Loss (FSPL) & Distance Attenuation Math",
        "conceptBudget": {
          "primaryConcept": "Free Space Path Loss (FSPL)",
          "supportingTerms": [
            "$\\text{FSPL(dB)} = 20\\log_{10}(d) + 20\\log_{10}(f) + 20\\log_{10}(4\\pi / c)$",
            "Inverse-Square Law ($6\\text{ dB}$ loss per doubling of distance)",
            "$+8.84\\text{ dB}$ advantage of 868 MHz over 2400 MHz"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FSPL Formula Breakdown in Code",
            "codeSnippet": "const c = 299792458; // Speed of light in m/s\nconst fsplDb = 20 * Math.log10(distanceMeters) + 20 * Math.log10(freqHz) + 20 * Math.log10((4 * Math.PI) / c);\n// Result gives exact RF signal attenuation through vacuum/air in decibels (dB)!",
            "lineNotes": {
              "2": "Logarithmic path loss scaling with distance and frequency."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fspl_calc_demo.js",
            "initialCode": "function calculateFspl(dMeters, fHz) {\n  const c = 299792458;\n  const fspl = 20 * Math.log10(dMeters) + 20 * Math.log10(fHz) + 20 * Math.log10((4 * Math.PI) / c);\n  return Number(fspl.toFixed(1));\n}\n\nconsole.log('1 km at 868 MHz:', calculateFspl(1000, 868000000), 'dB');\nconsole.log('1 km at 2.4 GHz:', calculateFspl(1000, 2400000000), 'dB');",
            "expectedOutput": "1 km at 868 MHz: 91.2 dB\n1 km at 2.4 GHz: 100 dB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Free Space Path Loss (in dB) for a 1 km link at 868 MHz?",
          "expectedStringOutput": "91.2",
          "acceptableAnswers": [
            "91.2",
            "91.2 dB",
            "91.2dB"
          ],
          "primaryMisconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
              "errorExplanation": "100 dB is for 2.4 GHz. 868 MHz suffers only 91.2 dB.",
              "recoveryPath": {
                "simplerExplanation": "868 MHz at 1 km = 91.2 dB.",
                "guidedFixPrompt": "Type 91.2"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d1-b3-rf-link-budget-margin",
        "day": 1,
        "blockNumber": 3,
        "title": "RF Link Budget, Receiver Sensitivity & Fade Margins",
        "conceptBudget": {
          "primaryConcept": "RF Link Budget Invariant",
          "supportingTerms": [
            "Transmit Power ($P_{\\text{TX}}$ in dBm)",
            "Antenna Gains ($G_{\\text{TX}}, G_{\\text{RX}}$ in dBi)",
            "Receiver Sensitivity ($S_{\\text{RX}}$ e.g. $-137\\text{ dBm}$ for LoRa)",
            "Fade Margin ($10-15\\text{ dB}$ buffer for rain/reflections)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b2-free-space-path-loss-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "link_budget_demo.js",
            "initialCode": "function evaluateLinkBudget(txDbm, txGain, rxGain, pathLossDb, sensitivityDbm, fadeMargin = 10) {\n  const receivedPower = txDbm + txGain + rxGain - pathLossDb;\n  const linkMargin = receivedPower - sensitivityDbm - fadeMargin;\n  const isFeasible = linkMargin >= 0;\n  return {\n    receivedPowerDbm: Number(receivedPower.toFixed(1)),\n    linkMarginDb: Number(linkMargin.toFixed(1)),\n    linkFeasible: isFeasible,\n    status: isFeasible ? 'LINK_BUDGET_CLOSED_SIGNAL_RELIABLE' : 'LINK_BUDGET_DEFICIT_NO_SIGNAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateLinkBudget(14, 2, 2, 91.2, -137, 10)));",
            "expectedOutput": "{\"receivedPowerDbm\":-73.2,\"linkMarginDb\":53.8,\"linkFeasible\":true,\"status\":\"LINK_BUDGET_CLOSED_SIGNAL_RELIABLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What link status is achieved when received signal power has a +53.8 dB margin above receiver sensitivity plus fade margin?",
          "expectedStringOutput": "LINK_BUDGET_CLOSED_SIGNAL_RELIABLE",
          "acceptableAnswers": [
            "LINK_BUDGET_CLOSED_SIGNAL_RELIABLE",
            "status\":\"LINK_BUDGET_CLOSED_SIGNAL_RELIABLE\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
          "diagnosisMap": {
            "DEFICIT": {
              "misconceptionId": "MC_IOTNET_SPECTRUM_SUBGHZ_VS_2_4GHZ_PROPAGATION",
              "errorExplanation": "Positive margin guarantees LINK_BUDGET_CLOSED_SIGNAL_RELIABLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches LINK_BUDGET_CLOSED_SIGNAL_RELIABLE.",
                "guidedFixPrompt": "Type LINK_BUDGET_CLOSED_SIGNAL_RELIABLE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Wi-Fi Networking & Embedded TCP/IP Stacks (LwIP)",
    "overviewMetaphor": "An Embedded Wi-Fi TCP/IP Stack is a busy drive-thru window on a microcontroller: the physical antenna receives high-speed radio waves (802.11 b/g/n); LwIP (Lightweight IP) is the tiny cashier operating with only 64 KB of RAM (Instead of creating infinite memory buffers, LwIP allocates fixed zero-copy packet buffers called pbufs; if incoming TCP packets arrive faster than the MCU can process, TCP flow control shrinks the window size to tell the sender to hit the brakes).",
    "blocks": [
      {
        "id": "iotnet-d2-b1-lwip-pbuf-architecture",
        "day": 2,
        "blockNumber": 1,
        "title": "LwIP Zero-Copy Packet Buffer (`pbuf`) Memory Pools",
        "conceptBudget": {
          "primaryConcept": "LwIP pbuf Architecture",
          "supportingTerms": [
            "Lightweight IP (LwIP)",
            "`pbuf` types: `PBUF_RAM` (Payload in dynamic RAM), `PBUF_ROM` (Flash pointer), `PBUF_REF` (Const RAM pointer), `PBUF_POOL` (Fixed-size chained buffers)",
            "Zero-copy memory preservation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LwIP Chained pbuf Linked List Layout",
              "boxes": [
                {
                  "label": "pbuf #1 (Header)",
                  "value": "next: -> pbuf #2 | len: 54 bytes (Ethernet + IP + TCP headers) | type: PBUF_RAM",
                  "varType": "TCP/IP Header",
                  "isUpdated": false
                },
                {
                  "label": "pbuf #2 (Payload Chnk 1)",
                  "value": "next: -> pbuf #3 | len: 512 bytes (Data chunk in pool buffer) | type: PBUF_POOL",
                  "varType": "Payload Chunk",
                  "isUpdated": false
                },
                {
                  "label": "pbuf #3 (Payload Tail)",
                  "value": "next: NULL | len: 256 bytes (Tail of incoming sensor payload) | type: PBUF_POOL",
                  "varType": "Payload Tail",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pbuf_chain_demo.js",
            "initialCode": "function traversePbufChain(pbufs) {\n  let totalBytes = 0;\n  for (const p of pbufs) totalBytes += p.len;\n  return `LwIP Zero-Copy Chained pbuf assembled: ${totalBytes} total wire bytes across ${pbufs.length} segments with 0 memory copies!`;\n}\n\nconsole.log(traversePbufChain([{ len: 54 }, { len: 512 }, { len: 256 }]));",
            "expectedOutput": "LwIP Zero-Copy Chained pbuf assembled: 822 total wire bytes across 3 segments with 0 memory copies!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total bytes are assembled across three chained pbufs of lengths 54, 512, and 256?",
          "expectedStringOutput": "822",
          "acceptableAnswers": [
            "822",
            "822 bytes",
            "822 total wire bytes"
          ],
          "primaryMisconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
          "diagnosisMap": {
            "768": {
              "misconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
              "errorExplanation": "54 + 512 + 256 = 822 total bytes.",
              "recoveryPath": {
                "simplerExplanation": "Sum is 822.",
                "guidedFixPrompt": "Type 822"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d2-b2-tcp-sliding-window-flow-control",
        "day": 2,
        "blockNumber": 2,
        "title": "TCP Sliding Window Flow Control & Buffer Exhaustion Defenses",
        "conceptBudget": {
          "primaryConcept": "TCP Sliding Window Flow Control",
          "supportingTerms": [
            "Advertised Window Size (`rcv_wnd`)",
            "In-Flight Unacknowledged Bytes",
            "Zero-Window Probe (Sender pauses when MCU buffer fills up)",
            "Buffer overrun prevention in constrained RAM"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d2-b1-lwip-pbuf-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Buffer Overflow Bug vs Sliding Window Flow Control Fix Diff",
              "brokenCode": "// ❌ NO FLOW CONTROL (MCU RAM Crash!):\nwhile (true) {\n  packet = receiveRadioPacket(); // Floods 50 KB/sec into 16 KB RAM -> Heap Panic!\n}",
              "fixedCode": "// ✅ TCP SLIDING WINDOW FLOW CONTROL (LwIP):\nif (availablePbufPoolSlots < 2) {\n  tcp_recved(pcb, 0); // Advertise rcv_wnd = 0 -> SENDER PAUSES TRANSMISSION!\n} else {\n  tcp_recved(pcb, processedBytes); // Advance sliding window as RAM frees up!\n}",
              "errorLine": 3,
              "errorReason": "Receiving unthrottled network packets on embedded MCUs exhausts the pbuf pool and causes a crash.",
              "fixExplanation": "Use TCP window advertising to pause remote senders when local buffers fill up."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tcp_window_demo.js",
            "initialCode": "function evaluateWindowHealth(freeBufferBytes) {\n  return (freeBufferBytes > 1460)\n    ? 'WINDOW_OPEN: NORMAL_DATA_FLOW'\n    : 'ZERO_WINDOW_ADVERTISED: REMOTE_SENDER_THROTTLED_TO_PREVENT_OOM';\n}\n\nconsole.log(evaluateWindowHealth(4096));\nconsole.log(evaluateWindowHealth(500));",
            "expectedOutput": "WINDOW_OPEN: NORMAL_DATA_FLOW\nZERO_WINDOW_ADVERTISED: REMOTE_SENDER_THROTTLED_TO_PREVENT_OOM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does LwIP prevent an embedded microcontroller with 32 KB RAM from crashing when a fast web server streams a 10 MB file?",
          "options": [
            "LwIP advertises a small TCP Receive Window (`rcv_wnd`); when local pbuf memory is full, it advertises a Zero Window, forcing the server to pause transmission until the MCU finishes processing",
            "It drops the Wi-Fi connection",
            "It automatically compresses the file into 1 byte"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
              "errorExplanation": "TCP sliding window flow control throttles the sender to match MCU consumption capacity.",
              "recoveryPath": {
                "simplerExplanation": "Zero-window flow control throttles the sender.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d2-b3-wifi-dtim-sleep-intervals",
        "day": 2,
        "blockNumber": 3,
        "title": "Wi-Fi Power Management: DTIM Beacon Listening Intervals",
        "conceptBudget": {
          "primaryConcept": "Wi-Fi DTIM Sleep Cycling",
          "supportingTerms": [
            "Delivery Traffic Indication Message (DTIM)",
            "Beacon Interval (Typically 100 ms)",
            "DTIM Period (Listen every $N$ beacons, e.g. DTIM 3 = wake every 300 ms)",
            "Modem-sleep (RF radio off, CPU active: 15 mA vs 150 mA)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d2-b2-tcp-sliding-window-flow-control",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dtim_sleep_demo.js",
            "initialCode": "function calculateDtimPowerSavings(dtimPeriod, beaconMs = 100) {\n  const wakeIntervalMs = dtimPeriod * beaconMs;\n  const wakeDutyPercent = (5 / wakeIntervalMs) * 100; // 5ms awake per DTIM\n  const avgCurrentMa = (wakeDutyPercent / 100) * 120 + ((100 - wakeDutyPercent) / 100) * 1.5;\n  return {\n    dtimPeriod,\n    wakeIntervalMs,\n    wakeDutyPercent: Number(wakeDutyPercent.toFixed(1)),\n    estimatedAverageCurrentMa: Number(avgCurrentMa.toFixed(1)),\n    powerMode: 'DTIM_LOW_POWER_LISTEN'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDtimPowerSavings(3, 100))); // DTIM 3 = 300ms",
            "expectedOutput": "{\"dtimPeriod\":3,\"wakeIntervalMs\":300,\"wakeDutyPercent\":1.7,\"estimatedAverageCurrentMa\":3.5,\"powerMode\":\"DTIM_LOW_POWER_LISTEN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the wake-up interval in milliseconds for a Wi-Fi station configured with DTIM period 3 and 100 ms beacon intervals?",
          "expectedStringOutput": "300",
          "acceptableAnswers": [
            "300",
            "300 ms",
            "wakeIntervalMs\":300"
          ],
          "primaryMisconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_IOTNET_WIFI_LWIP_TCP_SOCKET_BUFFER_EXHAUSTION",
              "errorExplanation": "3 * 100 ms = 300 ms wake interval.",
              "recoveryPath": {
                "simplerExplanation": "3 * 100 = 300 ms.",
                "guidedFixPrompt": "Type 300"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Bluetooth Low Energy (BLE) PHY & Advertising",
    "overviewMetaphor": "BLE Advertising is a digital lighthouse beacon: instead of establishing a complex phone call connection, a tiny temperature sensor shouts its 31-byte telemetry packet into the air every 500 milliseconds on 3 dedicated radio frequencies (Channels 37, 38, 39); nearby smartphones or gateways (Scanners) hear the broadcast in 2 milliseconds without pairing, and the sensor returns instantly to deep sleep, lasting 5 years on a coin cell battery.",
    "blocks": [
      {
        "id": "iotnet-d3-b1-ble-40-channel-rf-plan",
        "day": 3,
        "blockNumber": 1,
        "title": "BLE 40-Channel RF Plan: Advertising vs Data Channels",
        "conceptBudget": {
          "primaryConcept": "BLE 40-Channel RF Plan",
          "supportingTerms": [
            "40 RF Channels (2 MHz spacing from 2402 MHz to 2480 MHz)",
            "3 Primary Advertising Channels (37: 2402 MHz, 38: 2426 MHz, 39: 2480 MHz)",
            "Wi-Fi Coexistence: Adv channels strategically placed in Wi-Fi 1, 6, 11 spectral gaps",
            "37 Data Channels (0..36 with Frequency Hopping)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BLE 2.4 GHz Channel Spectrum Allocation",
              "boxes": [
                {
                  "label": "Channel 37 (2402 MHz)",
                  "value": "Advertising Primary #1 (Below Wi-Fi Channel 1)",
                  "varType": "Adv Channel",
                  "isUpdated": false
                },
                {
                  "label": "Channels 0 - 36 (2404 - 2478 MHz)",
                  "value": "Data Channels (Adaptive Frequency Hopping spread across band)",
                  "varType": "Data Channels",
                  "isUpdated": false
                },
                {
                  "label": "Channel 38 (2426 MHz)",
                  "value": "Advertising Primary #2 (Between Wi-Fi 1 and 6)",
                  "varType": "Adv Channel",
                  "isUpdated": false
                },
                {
                  "label": "Channel 39 (2480 MHz)",
                  "value": "Advertising Primary #3 (Above Wi-Fi Channel 11)",
                  "varType": "Adv Channel",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ble_channels_demo.js",
            "initialCode": "function evaluateBleChannel(chNum) {\n  if ([37, 38, 39].includes(chNum)) {\n    return 'PRIMARY_ADVERTISING_CHANNEL: PROXIMITY_BEACONS_AND_DISCOVERY';\n  }\n  return 'CONNECTED_DATA_CHANNEL: ADAPTIVE_FREQUENCY_HOPPING';\n}\n\nconsole.log('Channel 37:', evaluateBleChannel(37));\nconsole.log('Channel 12:', evaluateBleChannel(12));",
            "expectedOutput": "Channel 37: PRIMARY_ADVERTISING_CHANNEL: PROXIMITY_BEACONS_AND_DISCOVERY\nChannel 12: CONNECTED_DATA_CHANNEL: ADAPTIVE_FREQUENCY_HOPPING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What channel role applies to BLE Channel 37?",
          "expectedStringOutput": "PRIMARY_ADVERTISING_CHANNEL: PROXIMITY_BEACONS_AND_DISCOVERY",
          "acceptableAnswers": [
            "PRIMARY_ADVERTISING_CHANNEL: PROXIMITY_BEACONS_AND_DISCOVERY",
            "PRIMARY_ADVERTISING_CHANNEL"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
          "diagnosisMap": {
            "DATA": {
              "misconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
              "errorExplanation": "Channels 37, 38, and 39 are dedicated primary advertising channels.",
              "recoveryPath": {
                "simplerExplanation": "37, 38, 39 are advertising channels.",
                "guidedFixPrompt": "Type PRIMARY_ADVERTISING_CHANNEL: PROXIMITY_BEACONS_AND_DISCOVERY"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d3-b2-advertising-pdu-payload-structure",
        "day": 3,
        "blockNumber": 2,
        "title": "Advertising PDU Structure: LTV (Length-Type-Value) Fields",
        "conceptBudget": {
          "primaryConcept": "BLE Advertising PDU LTV Format",
          "supportingTerms": [
            "PDU Header (Type: `ADV_IND`, `ADV_NONCONN_IND`, `SCAN_REQ`, `SCAN_RSP`)",
            "31-Byte Payload Limit (Legacy BLE 4.x)",
            "LTV Elements: Length (1 byte) + AD Type (1 byte) + Data ($N$ bytes)",
            "AD Types: Flags (`0x01`), Complete Name (`0x09`), Manufacturer Data (`0xFF`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d3-b1-ble-40-channel-rf-plan",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BLE Advertising LTV Byte Sequence",
            "codeSnippet": "// 1. Flags: 02 (len) 01 (type: Flags) 06 (LE General Discoverable + BR/EDR not supported)\n// 2. Complete Name: 0A (len: 10) 09 (type: Name) 50 49 4E 49 54 5F 42 4C 45 ('PINIT_BLE')\n// Raw Hex: 0201060a0950494e49545f424c45 -> Total: 14 bytes (fits within 31 bytes!)",
            "lineNotes": {
              "1": "Flags structure defining discoverability.",
              "2": "UTF-8 local device name element."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ltv_parser_demo.js",
            "initialCode": "function parseLtv(hexStr) {\n  let offset = 0;\n  const records = [];\n  while (offset < hexStr.length) {\n    const len = parseInt(hexStr.slice(offset, offset + 2), 16);\n    if (len === 0) break;\n    const type = hexStr.slice(offset + 2, offset + 4);\n    const data = hexStr.slice(offset + 4, offset + 2 + len * 2);\n    records.push({ len, type: `0x${type}`, data });\n    offset += (len + 1) * 2;\n  }\n  return records;\n}\n\nconsole.log(JSON.stringify(parseLtv('020106070950696e4954')));",
            "expectedOutput": "[{\"len\":2,\"type\":\"0x01\",\"data\":\"06\"},{\"len\":7,\"type\":\"0x09\",\"data\":\"50696e4954\"}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total LTV records are parsed from the payload `020106070950696e4954`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 records"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
              "errorExplanation": "Contains two records: Flags (len 2) and Complete Name (len 7).",
              "recoveryPath": {
                "simplerExplanation": "Parses 2 LTV records.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d3-b3-ibeacon-eddystone-proximity",
        "day": 3,
        "blockNumber": 3,
        "title": "Beacon Formats: Apple iBeacon vs Google Eddystone Proximity",
        "conceptBudget": {
          "primaryConcept": "Proximity Beacon Formats",
          "supportingTerms": [
            "Apple iBeacon (`0x004C` Company ID, 16-byte UUID, 2-byte Major, 2-byte Minor, Measured TxPower at 1m)",
            "Google Eddystone (UID, URL, TLM Telemetry)",
            "Distance Estimation via RSSI Path Loss Formula ($d = 10^{(\\text{TxPower} - \\text{RSSI}) / (10n)}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d3-b2-advertising-pdu-payload-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rssi_distance_demo.js",
            "initialCode": "function estimateBeaconDistanceMeters(measuredTxPower1m, currentRssi, pathLossExp = 2.0) {\n  const ratio = (measuredTxPower1m - currentRssi) / (10 * pathLossExp);\n  const distance = Math.pow(10, ratio);\n  return {\n    measuredTxPower1m,\n    currentRssi,\n    estimatedDistanceMeters: Number(distance.toFixed(2)),\n    proximityZone: distance < 0.5 ? 'IMMEDIATE' : (distance < 3.0 ? 'NEAR' : 'FAR')\n  };\n}\n\nconsole.log(JSON.stringify(estimateBeaconDistanceMeters(-59, -59))); // At 1m\nconsole.log(JSON.stringify(estimateBeaconDistanceMeters(-59, -79))); // At 10m",
            "expectedOutput": "{\"measuredTxPower1m\":-59,\"currentRssi\":-59,\"estimatedDistanceMeters\":1,\"proximityZone\":\"NEAR\"}\n{\"measuredTxPower1m\":-59,\"currentRssi\":-79,\"estimatedDistanceMeters\":10,\"proximityZone\":\"FAR\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What estimated distance (in meters) is calculated when `currentRssi` matches the beacon's `measuredTxPower1m` (-59 dBm)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "1 meter",
            "estimatedDistanceMeters\":1"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_IOTNET_BLE_ADVERTISING_PDU_BEACON_PAYLOADS",
              "errorExplanation": "When RSSI equals measured power at 1 meter, the distance is exactly 1 meter.",
              "recoveryPath": {
                "simplerExplanation": "Distance = 1 meter.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "BLE GATT Architecture: Services, Characteristics & Descriptors",
    "overviewMetaphor": "GATT (Generic Attribute Profile) is an organized filing cabinet in a medical clinic: the GATT Server is the whole filing cabinet; each drawer is a Service (e.g. Heart Rate Service `0x180D`); inside each drawer are numbered folders called Characteristics (Folder `0x2A37` contains Heart Rate Measurement); inside the folder is a sticky note (Descriptor: Client Characteristic Configuration Descriptor `0x2902` CCCD) where the patient checks a box to receive real-time notifications.",
    "blocks": [
      {
        "id": "iotnet-d4-b1-gatt-server-client-hierarchy",
        "day": 4,
        "blockNumber": 1,
        "title": "GATT Hierarchy: Profiles, Services, Characteristics & Descriptors",
        "conceptBudget": {
          "primaryConcept": "GATT Architecture Hierarchy",
          "supportingTerms": [
            "GATT Server (Device holding sensor data) vs Client (Phone querying data)",
            "16-bit SIG UUIDs vs 128-bit Custom Vendor UUIDs",
            "Service (Collection of characteristics)",
            "Characteristic (Value + Properties + Permissions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d3-b2-advertising-pdu-payload-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GATT Server Attribute Hierarchy",
              "boxes": [
                {
                  "label": "Primary Service (0x180F)",
                  "value": "Battery Service -> Groups battery metrics",
                  "varType": "GATT Service",
                  "isUpdated": false
                },
                {
                  "label": "Characteristic (0x2A19)",
                  "value": "Battery Level -> Value: 85% | Properties: READ, NOTIFY",
                  "varType": "GATT Characteristic",
                  "isUpdated": true
                },
                {
                  "label": "CCCD Descriptor (0x2902)",
                  "value": "Client Characteristic Configuration -> Bitmask: 0x0001 (Notify Enabled)",
                  "varType": "GATT Descriptor",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gatt_hierarchy_demo.js",
            "initialCode": "function evaluateGattStructure(serviceUuid, charUuid) {\n  return `GATT_SERVER -> Service [${serviceUuid}] -> Characteristic [${charUuid}] -> READY_FOR_ATT_OPERATIONS`;\n}\n\nconsole.log(evaluateGattStructure('0x180F', '0x2A19'));",
            "expectedOutput": "GATT_SERVER -> Service [0x180F] -> Characteristic [0x2A19] -> READY_FOR_ATT_OPERATIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 16-bit SIG UUID corresponds to the standard Battery Level Characteristic?",
          "expectedStringOutput": "0x2A19",
          "acceptableAnswers": [
            "0x2A19",
            "2A19"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "0x180F": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "0x180F is the Battery Service. 0x2A19 is the Battery Level Characteristic.",
              "recoveryPath": {
                "simplerExplanation": "0x2A19 is the characteristic.",
                "guidedFixPrompt": "Type 0x2A19"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d4-b2-read-write-notify-indicate",
        "day": 4,
        "blockNumber": 2,
        "title": "ATT Operations: Read, Write, Write Without Response, Notify & Indicate",
        "conceptBudget": {
          "primaryConcept": "ATT Property Modes",
          "supportingTerms": [
            "`Read` (Client requests value, server responds)",
            "`Write` (Client sends value with application ACK)",
            "`Write Without Response` (High throughput unacknowledged write)",
            "`Notify` (Server pushes updates, 0 ACK, high speed)",
            "`Indicate` (Server pushes updates, requires ATT ACK from client)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d4-b1-gatt-server-client-hierarchy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Notify vs Indicate Comparison",
              "boxes": [
                {
                  "label": "Notify",
                  "value": "Speed: Ultra-fast | Overhead: 0 ACK bytes | Reliability: Unconfirmed stream",
                  "varType": "Streaming Mode",
                  "isUpdated": false
                },
                {
                  "label": "Indicate",
                  "value": "Speed: Medium (Waits for roundtrip) | Overhead: ATT_HANDLE_VALUE_CONF ACK | Reliability: Guaranteed delivery",
                  "varType": "Confirmed Mode",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "att_ops_demo.js",
            "initialCode": "function evaluateAttOperation(property) {\n  if (property === 'NOTIFY') return 'NOTIFY: SERVER_PUSH_NO_ACK_HIGH_THROUGHPUT';\n  if (property === 'INDICATE') return 'INDICATE: SERVER_PUSH_WITH_ATT_CONFIRMATION_ACK';\n  return 'STANDARD';\n}\n\nconsole.log(evaluateAttOperation('NOTIFY'));\nconsole.log(evaluateAttOperation('INDICATE'));",
            "expectedOutput": "NOTIFY: SERVER_PUSH_NO_ACK_HIGH_THROUGHPUT\nINDICATE: SERVER_PUSH_WITH_ATT_CONFIRMATION_ACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the key technical difference between BLE `Notify` and `Indicate` characteristic properties?",
          "options": [
            "`Notify` streams value updates from server to client with zero application-layer acknowledgments for maximum throughput; `Indicate` requires the client to send an ATT Handle Value Confirmation ACK before the next packet can be sent",
            "`Notify` is for text while `Indicate` is for images",
            "`Indicate` runs over Wi-Fi"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "Notify does not require ATT confirmations; Indicate enforces acknowledgments.",
              "recoveryPath": {
                "simplerExplanation": "Notify = unacknowledged stream; Indicate = acknowledged.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d4-b3-att-mtu-negotiation",
        "day": 4,
        "blockNumber": 3,
        "title": "ATT MTU Negotiation: Expanding Throughput Beyond 23 Bytes",
        "conceptBudget": {
          "primaryConcept": "ATT MTU Exchange",
          "supportingTerms": [
            "Default ATT MTU (23 bytes: 3-byte ATT header + 20 bytes data)",
            "MTU Exchange Request / Response",
            "Negotiating 247 or 512 bytes (Increases data throughput by 10x!)",
            "LE Data Length Extension (DLE)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d4-b2-read-write-notify-indicate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mtu_throughput_demo.js",
            "initialCode": "function calculateBleThroughput(attMtu, connIntervalMs = 15) {\n  const payloadBytes = attMtu - 3; // Subtract ATT Opcode (1B) + Attribute Handle (2B)\n  const packetsPerSec = 1000 / connIntervalMs;\n  const bytesPerSec = payloadBytes * packetsPerSec;\n  return {\n    attMtu,\n    effectivePayloadPerPacket: payloadBytes,\n    throughputBytesPerSec: Number(bytesPerSec.toFixed(0)),\n    status: attMtu > 23 ? 'MTU_EXPANDED_HIGH_THROUGHPUT' : 'DEFAULT_LEGACY_MTU'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBleThroughput(23, 15)));\nconsole.log(JSON.stringify(calculateBleThroughput(247, 15)));",
            "expectedOutput": "{\"attMtu\":23,\"effectivePayloadPerPacket\":20,\"throughputBytesPerSec\":1333,\"status\":\"DEFAULT_LEGACY_MTU\"}\n{\"attMtu\":247,\"effectivePayloadPerPacket\":244,\"throughputBytesPerSec\":16267,\"status\":\"MTU_EXPANDED_HIGH_THROUGHPUT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many effective payload data bytes are transmitted per packet when ATT MTU is negotiated to 247 bytes ($247 - 3$)?",
          "expectedStringOutput": "244",
          "acceptableAnswers": [
            "244",
            "244 bytes",
            "effectivePayloadPerPacket\":244"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "247": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "3 bytes are reserved for ATT opcode and handle, leaving 244 payload bytes.",
              "recoveryPath": {
                "simplerExplanation": "247 - 3 = 244 bytes.",
                "guidedFixPrompt": "Type 244"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine",
    "overviewMetaphor": "Milestone 1 — The Edge Multi-Radio Bridge: We build an industrial multi-radio gateway: scanning iBeacon proximity telemetry, parsing GATT heart rate and environmental sensor streams, managing dual 2.4 GHz antenna time-slicing (Coexistence), forwarding telemetry into LwIP TCP socket streams, and verifying zero packet drops under full wireless load.",
    "blocks": [
      {
        "id": "iotnet-d5-b1-multi-radio-gateway-orchestration",
        "day": 5,
        "blockNumber": 1,
        "title": "Multi-Radio Gateway Architecture & Telemetry Bridge",
        "conceptBudget": {
          "primaryConcept": "Multi-Radio Gateway Architecture",
          "supportingTerms": [
            "BLE GATT Collector",
            "iBeacon Scanner",
            "Wi-Fi Station Bridge",
            "LwIP Socket Forwarder"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d4-b1-gatt-server-client-hierarchy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "BLE-to-Wi-Fi Telemetry Forwarding Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "BLE Scanner captures advertising beacon & GATT notification packets",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Packet parser strips LTV headers & extracts sensor floating-point values",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "LwIP TCP socket buffers data in zero-copy pbuf pool",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "TCP sliding window streams data to Cloud Server -> 100% Delivery!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_bridge_demo.js",
            "initialCode": "function runGatewayCycle() {\n  return {\n    bleScannerStatus: 'BLE_GAP_SCANNING_ACTIVE',\n    gattCollectorStatus: 'GATT_NOTIFICATIONS_STREAMING',\n    wifiSocketStatus: 'LWIP_TCP_SOCKET_ESTABLISHED',\n    bridgeStatus: 'MULTI_RADIO_GATEWAY_NOMINAL'\n  };\n}\n\nconsole.log(runGatewayCycle().bridgeStatus);",
            "expectedOutput": "MULTI_RADIO_GATEWAY_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bridge status confirms operational synthesis of the Multi-Radio Gateway?",
          "expectedStringOutput": "MULTI_RADIO_GATEWAY_NOMINAL",
          "acceptableAnswers": [
            "MULTI_RADIO_GATEWAY_NOMINAL",
            "bridgeStatus: MULTI_RADIO_GATEWAY_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "Matches MULTI_RADIO_GATEWAY_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches MULTI_RADIO_GATEWAY_NOMINAL.",
                "guidedFixPrompt": "Type MULTI_RADIO_GATEWAY_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d5-b2-multi-radio-coexistence-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "2.4 GHz Antenna Coexistence & Radio Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Coexistence & Signal Invariant Audit",
          "supportingTerms": [
            "3-Wire PTA (Packet Traffic Arbitration)",
            "Wi-Fi / BLE Priority Signaling",
            "Zero RF collision packet loss guarantee"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d5-b1-multi-radio-gateway-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coex_audit_demo.js",
            "initialCode": "function auditCoexistenceQuality(packetsTotal, collisionDrops) {\n  const dropRate = (collisionDrops / packetsTotal) * 100;\n  const isClean = dropRate === 0;\n  return {\n    packetsTotal,\n    collisionDrops,\n    dropRatePercent: dropRate,\n    grade: isClean ? 'RADIO_COEXISTENCE_AUDIT_PASSED' : 'COEXISTENCE_COLLISION_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCoexistenceQuality(5000, 0)));",
            "expectedOutput": "{\"packetsTotal\":5000,\"collisionDrops\":0,\"dropRatePercent\":0,\"grade\":\"RADIO_COEXISTENCE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when 5,000 multi-radio packets are forwarded with 0 collision drops?",
          "expectedStringOutput": "RADIO_COEXISTENCE_AUDIT_PASSED",
          "acceptableAnswers": [
            "RADIO_COEXISTENCE_AUDIT_PASSED",
            "grade\":\"RADIO_COEXISTENCE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "Zero drops awards RADIO_COEXISTENCE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards RADIO_COEXISTENCE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type RADIO_COEXISTENCE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d5-b3-milestone1-iotnet-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Multi-Radio Embedded Gateway Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Multi-Radio Gateway Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d5-b2-multi-radio-coexistence-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_iotnet_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete BLE / Wi-Fi Multi-Radio Embedded Gateway Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "BLE Mesh: Managed Flooding, Relays & Provisioning",
    "overviewMetaphor": "BLE Mesh is a human bucket brigade fighting a fire across a 10-story skyscraper: instead of requiring every bucket to reach the fire chief on the roof in one giant throw (Impossible single-hop range!), each person hands the bucket to their nearest neighbor (Managed Flooding with Relay Nodes); each bucket has a tag stamped with the bucket ID (Message Cache prevents accepting the same bucket twice) and a counter with 5 stamps (TTL decrements by 1 per person to prevent buckets from circulating forever).",
    "blocks": [
      {
        "id": "iotnet-d6-b1-managed-flooding-and-message-cache",
        "day": 6,
        "blockNumber": 1,
        "title": "Managed Flooding Architecture & The Message Cache Deduplicator",
        "conceptBudget": {
          "primaryConcept": "BLE Mesh Managed Flooding",
          "supportingTerms": [
            "Managed Flooding (Broadcast-based multi-path message propagation)",
            "Message Cache (Deduplicating `(SRC, SEQ)` pairs in RAM)",
            "TTL (Time-To-Live hop counter)",
            "Eliminating single points of failure without routing tables"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d3-b1-ble-40-channel-rf-plan",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "BLE Mesh Relay & Deduplication Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Relay Node receives BLE Mesh Adv PDU",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Is (SRC, SEQ) in Message Cache? -> YES -> DROP DUPLICATE",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Is TTL > 1? -> YES -> Decrement TTL = TTL - 1",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Re-broadcast packet on advertising channels -> Message propagates!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mesh_flood_demo.js",
            "initialCode": "function processMeshPacket(cache, src, seq, ttl) {\n  const key = `${src}_${seq}`;\n  if (cache.has(key)) return 'DROPPED_DUPLICATE';\n  cache.add(key);\n  if (ttl <= 1) return 'DROPPED_TTL_EXPIRED';\n  return `RELAYED_NEW_TTL_${ttl - 1}`;\n}\n\nconst c = new Set();\nconsole.log(processMeshPacket(c, '0x0001', 101, 5));\nconsole.log(processMeshPacket(c, '0x0001', 101, 5)); // Duplicate\nconsole.log(processMeshPacket(c, '0x0002', 201, 1)); // TTL 1",
            "expectedOutput": "RELAYED_NEW_TTL_4\nDROPPED_DUPLICATE\nDROPPED_TTL_EXPIRED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken when a BLE mesh packet arrives with a `(SRC, SEQ)` key that is already stored in the node's Message Cache?",
          "expectedStringOutput": "DROPPED_DUPLICATE",
          "acceptableAnswers": [
            "DROPPED_DUPLICATE",
            "Dropped duplicate"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
          "diagnosisMap": {
            "RELAYED": {
              "misconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
              "errorExplanation": "Duplicate messages are dropped to prevent broadcast storms.",
              "recoveryPath": {
                "simplerExplanation": "Duplicates are dropped.",
                "guidedFixPrompt": "Type DROPPED_DUPLICATE"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d6-b2-friend-and-low-power-nodes",
        "day": 6,
        "blockNumber": 2,
        "title": "Friendship Feature: Friend Nodes & Low Power Nodes (LPN)",
        "conceptBudget": {
          "primaryConcept": "BLE Mesh Friendship Feature",
          "supportingTerms": [
            "Low Power Node (LPN: Sleeps 99.9% of time on coin cell)",
            "Friend Node (Mains-powered relay storing messages in Friend Queue for LPN)",
            "Friend Poll / Friend Update handshake",
            "PollTimeout interval"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d6-b1-managed-flooding-and-message-cache",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Friendship Architecture Breakdown",
              "boxes": [
                {
                  "label": "1. Friend Node (Mains Powered)",
                  "value": "Always listening -> Holds Friend Queue buffer for sleeping sensor",
                  "varType": "Friend Relay",
                  "isUpdated": false
                },
                {
                  "label": "2. Low Power Node (LPN)",
                  "value": "Sleeps deep -> Wakes every 60s -> Sends Friend Poll -> Receives buffered msgs",
                  "varType": "Sleeping Sensor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "friendship_demo.js",
            "initialCode": "function simulateFriendshipPoll(friendQueue, lpnAwake) {\n  if (!lpnAwake) return { lpnState: 'DEEP_SLEEP', queuedMessages: friendQueue.length };\n  const delivered = [...friendQueue];\n  friendQueue.length = 0;\n  return {\n    lpnState: 'POLLING',\n    messagesReceived: delivered,\n    status: 'FRIEND_QUEUE_FLUSHED_TO_LPN'\n  };\n}\n\nconst q = ['MSG_LIGHT_ON', 'MSG_SET_TEMP_22C'];\nconsole.log(JSON.stringify(simulateFriendshipPoll(q, true)));",
            "expectedOutput": "{\"lpnState\":\"POLLING\",\"messagesReceived\":[\"MSG_LIGHT_ON\",\"MSG_SET_TEMP_22C\"],\"status\":\"FRIEND_QUEUE_FLUSHED_TO_LPN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the BLE Mesh Friendship feature enable coin-cell sensors to participate in a mesh network?",
          "options": [
            "A mains-powered Friend Node buffers incoming mesh messages in a Friend Queue while the Low Power Node (LPN) sleeps, delivering the buffered packets only when the LPN periodically wakes and polls",
            "By increasing antenna transmit power to 100 Watts",
            "By replacing BLE with Wi-Fi"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
              "errorExplanation": "Friend nodes buffer messages for sleeping LPNs.",
              "recoveryPath": {
                "simplerExplanation": "Friend node buffers messages while sensor sleeps.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d6-b3-mesh-provisioning-and-security",
        "day": 6,
        "blockNumber": 3,
        "title": "BLE Mesh Provisioning, NetKey & AppKey Cryptography",
        "conceptBudget": {
          "primaryConcept": "BLE Mesh Security Keys",
          "supportingTerms": [
            "Network Key (`NetKey`: Secures network layer communication)",
            "Application Key (`AppKey`: Secures specific application payloads, e.g. lighting vs HVAC)",
            "Device Key (`DevKey`: Point-to-point configuration)",
            "ECDH P-256 Key Exchange during Provisioning"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d6-b2-friend-and-low-power-nodes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mesh_keys_demo.js",
            "initialCode": "function evaluateMeshSecurityLayers() {\n  return 'BLE Mesh Two-Layer Security: 1. NetKey decrypts network layer for relaying | 2. AppKey decrypts sensor payload only at destination node!';\n}\n\nconsole.log(evaluateMeshSecurityLayers());",
            "expectedOutput": "BLE Mesh Two-Layer Security: 1. NetKey decrypts network layer for relaying | 2. AppKey decrypts sensor payload only at destination node!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which cryptographic key secures the network layer so intermediate relay nodes can authenticate packets without decrypting the application payload?",
          "expectedStringOutput": "NetKey",
          "acceptableAnswers": [
            "NetKey",
            "Network Key",
            "NetKey (Network Key)"
          ],
          "primaryMisconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
          "diagnosisMap": {
            "AppKey": {
              "misconceptionId": "MC_IOTNET_BLE_MESH_FLOODING_RELAY_NODES",
              "errorExplanation": "AppKey is for application payloads. NetKey authenticates the network layer.",
              "recoveryPath": {
                "simplerExplanation": "NetKey secures the network layer.",
                "guidedFixPrompt": "Type NetKey"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Zigbee (IEEE 802.15.4) & Thread IPv6 Wireless Mesh",
    "overviewMetaphor": "Zigbee vs Thread is an Old Walkie-Talkie Tree vs a Modern Internet Mesh: Zigbee is a single commander tree (One PAN Coordinator starts the network; if the coordinator dies, no new devices can join, and data uses proprietary Zigbee clusters); Thread is true native IPv6 (Every light bulb and thermostat gets its own global IPv6 address; if the network leader fails, other routers automatically elect a new leader in 200 ms with zero downtime, and messages route directly to the cloud via Thread Border Routers).",
    "blocks": [
      {
        "id": "iotnet-d7-b1-ieee-802154-phy-mac-foundations",
        "day": 7,
        "blockNumber": 1,
        "title": "IEEE 802.15.4 Physical & MAC Layer Foundations",
        "conceptBudget": {
          "primaryConcept": "IEEE 802.15.4 Foundations",
          "supportingTerms": [
            "2.4 GHz Direct Sequence Spread Spectrum (DSSS) with O-QPSK modulation",
            "250 kbps raw bitrate",
            "16 channels (Channels 11..26 in 5 MHz increments: $2405 + 5(k-11)\\text{ MHz}$)",
            "CSMA-CA (Carrier Sense Multiple Access with Collision Avoidance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "802.15.4 Channel Frequency Equation",
            "codeSnippet": "function getChannelFreq(ch) {\n  // Channels 11 to 26 in 2.4 GHz band:\n  return 2405 + 5 * (ch - 11); // e.g. Channel 11 = 2405 MHz; Channel 26 = 2480 MHz\n}",
            "lineNotes": {
              "3": "Calculates center frequency in MHz."
            }
          },
          {
            "type": "runnable_code",
            "filename": "channel_802154_demo.js",
            "initialCode": "function calculate802154Freq(ch) {\n  if (ch < 11 || ch > 26) return 'INVALID_CHANNEL';\n  return `${2405 + 5 * (ch - 11)} MHz`;\n}\n\nconsole.log('Channel 11:', calculate802154Freq(11));\nconsole.log('Channel 15:', calculate802154Freq(15));\nconsole.log('Channel 26:', calculate802154Freq(26));",
            "expectedOutput": "Channel 11: 2405 MHz\nChannel 15: 2425 MHz\nChannel 26: 2480 MHz",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the center frequency in MHz for IEEE 802.15.4 Channel 15 ($2405 + 5 \\times (15-11)$)?",
          "expectedStringOutput": "2425 MHz",
          "acceptableAnswers": [
            "2425 MHz",
            "2425",
            "2425MHz"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ZIGBEE_802154_PAN_COORDINATOR_ROUTER",
          "diagnosisMap": {
            "2405": {
              "misconceptionId": "MC_IOTNET_ZIGBEE_802154_PAN_COORDINATOR_ROUTER",
              "errorExplanation": "2405 is Channel 11. Channel 15 is 2425 MHz.",
              "recoveryPath": {
                "simplerExplanation": "2405 + 20 = 2425 MHz.",
                "guidedFixPrompt": "Type 2425 MHz"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d7-b2-zigbee-pro-pan-coordinators",
        "day": 7,
        "blockNumber": 2,
        "title": "Zigbee PRO Topology: PAN Coordinator, Routers & End Devices",
        "conceptBudget": {
          "primaryConcept": "Zigbee PRO Topology",
          "supportingTerms": [
            "PAN Coordinator (Forms network, allocates 16-bit short addresses, single root)",
            "Zigbee Routers (ZR: Mains-powered packet forwarders)",
            "Sleepy End Devices (ZED: Battery sensors reporting to parent router)",
            "Zigbee Cluster Library (ZCL)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d7-b1-ieee-802154-phy-mac-foundations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Zigbee Device Role Comparison",
              "boxes": [
                {
                  "label": "1. Coordinator (ZC)",
                  "value": "Address: 0x0000 | Single root of PAN | Manages security keys & network formation",
                  "varType": "Network Root",
                  "isUpdated": false
                },
                {
                  "label": "2. Router (ZR)",
                  "value": "Mains powered | Extends mesh tree | Holds routing tables & forwards frames",
                  "varType": "Mesh Router",
                  "isUpdated": false
                },
                {
                  "label": "3. End Device (ZED)",
                  "value": "Battery powered | Sleeps deep | Cannot forward packets; communicates ONLY via parent",
                  "varType": "End Sensor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zigbee_roles_demo.js",
            "initialCode": "function evaluateZigbeeRole(role) {\n  if (role === 'ZC') return 'COORDINATOR: SINGLE_POINT_OF_NETWORK_FORMATION';\n  if (role === 'ZR') return 'ROUTER: MESH_FORWARDER_ACTIVE';\n  return 'END_DEVICE: BATTERY_SLEEPY_CHILD';\n}\n\nconsole.log(evaluateZigbeeRole('ZC'));\nconsole.log(evaluateZigbeeRole('ZR'));",
            "expectedOutput": "COORDINATOR: SINGLE_POINT_OF_NETWORK_FORMATION\nROUTER: MESH_FORWARDER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fixed 16-bit short network address is always assigned to the Zigbee PAN Coordinator?",
          "expectedStringOutput": "0x0000",
          "acceptableAnswers": [
            "0x0000",
            "0000",
            "0"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ZIGBEE_802154_PAN_COORDINATOR_ROUTER",
          "diagnosisMap": {
            "0xFFFF": {
              "misconceptionId": "MC_IOTNET_ZIGBEE_802154_PAN_COORDINATOR_ROUTER",
              "errorExplanation": "0xFFFF is broadcast. The Coordinator is always 0x0000.",
              "recoveryPath": {
                "simplerExplanation": "Coordinator address is always 0x0000.",
                "guidedFixPrompt": "Type 0x0000"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d7-b3-thread-ipv6-border-routers",
        "day": 7,
        "blockNumber": 3,
        "title": "Thread Protocol: IPv6 Native Mesh & Border Router Integration",
        "conceptBudget": {
          "primaryConcept": "Thread IPv6 Mesh Architecture",
          "supportingTerms": [
            "No Single Point of Failure (Dynamic Leader election if current leader drops)",
            "6LoWPAN native IPv6 addressing (`fd00::...`)",
            "Thread Border Router (Transparently bridges 802.15.4 mesh to Wi-Fi / Ethernet LAN)",
            "Matter Smart Home Standard Foundation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d7-b2-zigbee-pro-pan-coordinators",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "thread_mesh_demo.js",
            "initialCode": "function evaluateThreadTopology(leaderActive) {\n  return leaderActive\n    ? 'THREAD_MESH_OPERATIONAL: LEADER_ACTIVE_FULL_IPV6_ROUTING'\n    : 'SELF_HEALING_TRIGGERED: ROUTER_ELECTED_AS_NEW_LEADER_IN_200MS';\n}\n\nconsole.log(evaluateThreadTopology(true));\nconsole.log(evaluateThreadTopology(false));",
            "expectedOutput": "THREAD_MESH_OPERATIONAL: LEADER_ACTIVE_FULL_IPV6_ROUTING\nSELF_HEALING_TRIGGERED: ROUTER_ELECTED_AS_NEW_LEADER_IN_200MS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Thread considered more resilient than traditional Zigbee for modern smart home deployments (Matter standard)?",
          "options": [
            "Because Thread is native IPv6 with no single point of failure; if the network Leader fails, another router is autonomously elected Leader in milliseconds, and Thread Border Routers connect directly to IP networks without application gateways",
            "Because Thread uses Bluetooth",
            "Because Thread does not use radio"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_THREAD_IP6_BORDER_ROUTER_COAP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_THREAD_IP6_BORDER_ROUTER_COAP",
              "errorExplanation": "Thread's native IPv6 and autonomous leader election eliminate single coordinator failure bottlenecks.",
              "recoveryPath": {
                "simplerExplanation": "Native IPv6 with self-healing leader election.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "LoRa & Chirp Spread Spectrum (CSS) Modulation",
    "overviewMetaphor": "LoRa Chirp Spread Spectrum (CSS) is like whistling across a roaring hurricane: standard radio transmissions are steady hums that drown in background static (Thermal Noise); LoRa sweeps its pitch continuously upwards like a slide whistle (Up-Chirp from low to high frequency); even when wind and noise are 20 dB louder than the whistle itself, the mathematical receiver reconstructs the pitch sweep trajectory perfectly, extracting data over 15 kilometers with tiny battery power.",
    "blocks": [
      {
        "id": "iotnet-d8-b1-chirp-spread-spectrum-physics",
        "day": 8,
        "blockNumber": 1,
        "title": "Chirp Spread Spectrum (CSS) Modulation & Up/Down Chirps",
        "conceptBudget": {
          "primaryConcept": "Chirp Spread Spectrum (CSS)",
          "supportingTerms": [
            "Linear Frequency Modulation (Chirp sweeping continuously across bandwidth $\\text{BW}$)",
            "Up-Chirp (Preamble & Data symbols)",
            "Down-Chirp (Sync word & framing)",
            "High Doppler and multipath fading immunity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LoRa CSS Frequency Sweep Diagram",
              "boxes": [
                {
                  "label": "1. Up-Chirp Symbol",
                  "value": "Frequency sweeps linearly from f_low -> f_high over Symbol Time Ts",
                  "varType": "Up-Chirp",
                  "isUpdated": false
                },
                {
                  "label": "2. Cyclic Shift Data Encoding",
                  "value": "Symbol value (0..2^SF-1) encoded by initial start frequency offset",
                  "varType": "Cyclic Shift",
                  "isUpdated": true
                },
                {
                  "label": "3. Down-Chirp Framing",
                  "value": "Frequency sweeps from f_high -> f_low (Synchronizes receiver lock)",
                  "varType": "Down-Chirp",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "chirp_physics_demo.js",
            "initialCode": "function evaluateCssImmunity(snrDb) {\n  return (snrDb >= -20)\n    ? 'LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR'\n    : 'SIGNAL_BELOW_MINIMUM_CSS_SENSITIVITY';\n}\n\nconsole.log(evaluateCssImmunity(-15));\nconsole.log(evaluateCssImmunity(-25));",
            "expectedOutput": "LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR\nSIGNAL_BELOW_MINIMUM_CSS_SENSITIVITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What demodulation status is achieved when a LoRa receiver decodes a signal at -15 dB SNR (15 dB below the RF noise floor)?",
          "expectedStringOutput": "LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR",
          "acceptableAnswers": [
            "LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR",
            "LORA_DEMODULATION_SUCCESSFUL"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "BELOW": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "-15 dB is well within the -20 dB LoRa sensitivity threshold.",
              "recoveryPath": {
                "simplerExplanation": "Matches LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR.",
                "guidedFixPrompt": "Type LORA_DEMODULATION_SUCCESSFUL: OPERATING_20DB_BELOW_NOISE_FLOOR"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d8-b2-spreading-factors-and-symbol-duration",
        "day": 8,
        "blockNumber": 2,
        "title": "Spreading Factors (SF7..SF12) & Symbol Duration Math",
        "conceptBudget": {
          "primaryConcept": "Spreading Factor Math",
          "supportingTerms": [
            "Spreading Factor (SF: Bits encoded per chirp symbol from 7 to 12)",
            "Number of chips per symbol: $2^{\\text{SF}}$ (SF7 = 128 chips; SF12 = 4096 chips)",
            "Symbol Duration: $T_s = \\frac{2^{\\text{SF}}}{\\text{BW}}$",
            "Trade-off: Higher SF = Higher sensitivity and range, but longer airtime and higher battery use"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d8-b1-chirp-spread-spectrum-physics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sf_math_demo.js",
            "initialCode": "function calculateSymbolTimeMs(sf, bwKhz = 125) {\n  const chips = Math.pow(2, sf);\n  const tsMs = (chips / (bwKhz * 1000)) * 1000;\n  return {\n    spreadingFactor: `SF${sf}`,\n    chipsPerSymbol: chips,\n    symbolDurationMs: Number(tsMs.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(calculateSymbolTimeMs(7, 125)));\nconsole.log(JSON.stringify(calculateSymbolTimeMs(12, 125)));",
            "expectedOutput": "{\"spreadingFactor\":\"SF7\",\"chipsPerSymbol\":128,\"symbolDurationMs\":1.024}\n{\"spreadingFactor\":\"SF12\",\"chipsPerSymbol\":4096,\"symbolDurationMs\":32.768}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the exact symbol duration in milliseconds for LoRa SF7 at 125 kHz bandwidth ($128 / 125000 \\times 1000$)?",
          "expectedStringOutput": "1.024",
          "acceptableAnswers": [
            "1.024",
            "1.024 ms",
            "symbolDurationMs\":1.024"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "32.768": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "32.768 ms is for SF12. SF7 is 1.024 ms.",
              "recoveryPath": {
                "simplerExplanation": "SF7 symbol time = 1.024 ms.",
                "guidedFixPrompt": "Type 1.024"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d8-b3-spreading-factor-orthogonality",
        "day": 8,
        "blockNumber": 3,
        "title": "Orthogonality of Spreading Factors: Multi-Signal Channel Sharing",
        "conceptBudget": {
          "primaryConcept": "Spreading Factor Orthogonality",
          "supportingTerms": [
            "Orthogonal Signal Separation (Signals with different SFs appear as white noise to each other)",
            "Simultaneous Transmission on identical frequency channel",
            "Gateway multi-SF parallel demodulation (8 channels $\\times$ 6 SFs = 48 virtual channels)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d8-b2-spreading-factors-and-symbol-duration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "orthogonality_demo.js",
            "initialCode": "function evaluateCollision(nodeA_Freq, nodeA_SF, nodeB_Freq, nodeB_SF) {\n  const sameFreq = (nodeA_Freq === nodeB_Freq);\n  const sameSf = (nodeA_SF === nodeB_SF);\n  if (sameFreq && sameSf) {\n    return 'COLLISION_DETECTED: IDENTICAL_FREQUENCY_AND_SPREADING_FACTOR';\n  }\n  if (sameFreq && !sameSf) {\n    return 'ORTHOGONAL_SIGNALS_ACCEPTED: PARALLEL_DEMODULATION_SUCCESSFUL';\n  }\n  return 'DISTINCT_FREQUENCY_CHANNELS';\n}\n\nconsole.log(evaluateCollision(868.1, 7, 868.1, 10)); // Same freq, different SF\nconsole.log(evaluateCollision(868.1, 7, 868.1, 7));  // Same freq, same SF",
            "expectedOutput": "ORTHOGONAL_SIGNALS_ACCEPTED: PARALLEL_DEMODULATION_SUCCESSFUL\nCOLLISION_DETECTED: IDENTICAL_FREQUENCY_AND_SPREADING_FACTOR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What outcome occurs when Node A transmits on 868.1 MHz using SF7 while Node B transmits at the exact same moment on 868.1 MHz using SF10?",
          "expectedStringOutput": "ORTHOGONAL_SIGNALS_ACCEPTED: PARALLEL_DEMODULATION_SUCCESSFUL",
          "acceptableAnswers": [
            "ORTHOGONAL_SIGNALS_ACCEPTED: PARALLEL_DEMODULATION_SUCCESSFUL",
            "ORTHOGONAL_SIGNALS_ACCEPTED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "COLLISION": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "Different spreading factors are orthogonal, allowing parallel demodulation without collision.",
              "recoveryPath": {
                "simplerExplanation": "Different SFs do not collide.",
                "guidedFixPrompt": "Type ORTHOGONAL_SIGNALS_ACCEPTED: PARALLEL_DEMODULATION_SUCCESSFUL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "LoRaWAN Network Architecture: End Devices, Gateways & Network Server",
    "overviewMetaphor": "LoRaWAN is a citywide open-microphone public address system: an agricultural soil moisture sensor in a vineyard broadcasts a short LoRa message; every LoRaWAN gateway tower within a 15-kilometer radius hears the message and transparently forwards it over Ethernet/Cellular to a central cloud Network Server (The Things Stack / ChirpStack); the Network Server discards duplicate receptions, checks cryptographic keys, and forwards the clean sensor payload to the farm's dashboard.",
    "blocks": [
      {
        "id": "iotnet-d9-b1-star-of-stars-topology",
        "day": 9,
        "blockNumber": 1,
        "title": "LoRaWAN Star-of-Stars Topology & Multi-Gateway Reception",
        "conceptBudget": {
          "primaryConcept": "LoRaWAN Star-of-Stars Topology",
          "supportingTerms": [
            "Star-of-Stars Architecture (Nodes broadcast without connecting to a specific gateway)",
            "Transparent Forwarding (Gateways forward all overheard frames without association)",
            "Network Server (Central intelligence managing deduplication, ADR, and downlinks)",
            "Application Server (Decodes decrypted payload)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d8-b1-chirp-spread-spectrum-physics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "LoRaWAN Uplink Packet Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "End Device broadcasts RF uplink using SF7..SF12",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Gateways A, B, and C all overhear packet -> Forward IP frame to Network Server",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Network Server deduplicates packet & validates MIC signature",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Decrypted payload routed to Application Server MQTT/Webhook endpoint!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dedup_flow_demo.js",
            "initialCode": "function deduplicatePackets(gatewayUplinks) {\n  const uniquePayloads = new Map();\n  for (const up of gatewayUplinks) {\n    const key = up.devAddr + '_' + up.fCnt;\n    if (!uniquePayloads.has(key)) {\n      uniquePayloads.set(key, { devAddr: up.devAddr, fCnt: up.fCnt, payload: up.payload, heardByGateways: 1, bestRssi: up.rssi });\n    } else {\n      const item = uniquePayloads.get(key);\n      item.heardByGateways++;\n      item.bestRssi = Math.max(item.bestRssi, up.rssi);\n    }\n  }\n  return Array.from(uniquePayloads.values());\n}\n\nconst raw = [\n  { devAddr: '0x26011234', fCnt: 42, payload: '24.5C', rssi: -105 },\n  { devAddr: '0x26011234', fCnt: 42, payload: '24.5C', rssi: -85 } // Gateway 2 heard same packet\n];\nconsole.log(JSON.stringify(deduplicatePackets(raw)));",
            "expectedOutput": "[{\"devAddr\":\"0x26011234\",\"fCnt\":42,\"payload\":\"24.5C\",\"heardByGateways\":2,\"bestRssi\":-85}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many unique packets are delivered to the Application Server after deduplicating the two gateway reports?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1 packet",
            "one"
          ],
          "primaryMisconceptionId": "MC_IOTNET_GATEWAY_ARCHITECTURE_PACKET_FORWARDER",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_IOTNET_GATEWAY_ARCHITECTURE_PACKET_FORWARDER",
              "errorExplanation": "Duplicate gateway receptions of the same frame counter are deduplicated into 1 packet.",
              "recoveryPath": {
                "simplerExplanation": "Deduplicated into 1 packet.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d9-b2-semtech-packet-forwarder-protocol",
        "day": 9,
        "blockNumber": 2,
        "title": "Semtech UDP Packet Forwarder vs Basic Station Protocol",
        "conceptBudget": {
          "primaryConcept": "Gateway Packet Forwarder Protocols",
          "supportingTerms": [
            "Legacy Semtech UDP Protocol (JSON over UDP port 1700, no TLS, packet loss prone)",
            "LoRa Basics Station (Modern standard: Secure WebSockets over TLS, remote CUPS configuration, client certificate authentication)",
            "Concentrator chipsets (SX1301, SX1302, SX1303)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d9-b1-star-of-stars-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Gateway Protocol Comparison",
              "boxes": [
                {
                  "label": "1. Semtech UDP Forwarder",
                  "value": "Protocol: UDP 1700 | Security: NONE (Plaintext) | Management: Manual local config",
                  "varType": "Legacy UDP",
                  "isUpdated": false
                },
                {
                  "label": "2. LoRa Basics Station",
                  "value": "Protocol: WebSockets WSS | Security: TLS Mutual Auth | Management: Automated CUPS / LNS updates",
                  "varType": "Modern TLS",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_proto_demo.js",
            "initialCode": "function evaluateGatewayProtocol(proto) {\n  return (proto === 'BASICS_STATION')\n    ? 'BASICS_STATION: SECURE_WSS_TLS_AUTHENTICATED_WITH_CUPS_MANAGEMENT'\n    : 'LEGACY_UDP: UNENCRYPTED_UDP_PORT_1700';\n}\n\nconsole.log(evaluateGatewayProtocol('BASICS_STATION'));\nconsole.log(evaluateGatewayProtocol('SEMTECH_UDP'));",
            "expectedOutput": "BASICS_STATION: SECURE_WSS_TLS_AUTHENTICATED_WITH_CUPS_MANAGEMENT\nLEGACY_UDP: UNENCRYPTED_UDP_PORT_1700",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why has Semtech 'LoRa Basics Station' replaced the legacy UDP packet forwarder in production enterprise deployments?",
          "options": [
            "Because Basics Station uses encrypted WebSockets over TLS with client certificate authentication and automated configuration updates (CUPS), eliminating insecure plaintext UDP 1700 traffic",
            "Because Basics Station requires no internet connection",
            "Because UDP was banned by ISO"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_GATEWAY_ARCHITECTURE_PACKET_FORWARDER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_GATEWAY_ARCHITECTURE_PACKET_FORWARDER",
              "errorExplanation": "Basics Station brings TLS encryption, mutual auth, and CUPS automated management.",
              "recoveryPath": {
                "simplerExplanation": "Uses TLS encryption and automated central management.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d9-b3-adaptive-data-rate-adr",
        "day": 9,
        "blockNumber": 3,
        "title": "Adaptive Data Rate (ADR): Dynamic Spreading Factor Optimization",
        "conceptBudget": {
          "primaryConcept": "Adaptive Data Rate (ADR)",
          "supportingTerms": [
            "ADR Algorithm (Network Server monitors SNR of past 20 uplinks)",
            "Close Node Optimization (Instructs node to drop from SF12 to SF7, cutting airtime by 30x and saving 95% battery!)",
            "Far Node Robustness (Steps up SF and increases TxPower when signal degrades)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d9-b2-semtech-packet-forwarder-protocol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "adr_algorithm_demo.js",
            "initialCode": "function evaluateAdrAdjustment(avgSnrDb, currentSf) {\n  // If SNR is high (+10 dB), node is very close to gateway -> switch to SF7!\n  if (avgSnrDb > 5 && currentSf > 7) {\n    return { targetSf: 7, txPowerDbm: 10, action: 'OPTIMIZE_FAST_SF7_MAX_BATTERY_SAVINGS' };\n  }\n  if (avgSnrDb < -15 && currentSf < 12) {\n    return { targetSf: currentSf + 1, txPowerDbm: 14, action: 'INCREASE_SF_FOR_RANGE_ROBUSTNESS' };\n  }\n  return { targetSf: currentSf, txPowerDbm: 14, action: 'MAINTAIN_CURRENT_RADIO_PROFILE' };\n}\n\nconsole.log(JSON.stringify(evaluateAdrAdjustment(8.5, 12)));",
            "expectedOutput": "{\"targetSf\":7,\"txPowerDbm\":10,\"action\":\"OPTIMIZE_FAST_SF7_MAX_BATTERY_SAVINGS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What target Spreading Factor is assigned by ADR to a node currently using SF12 when its average SNR is +8.5 dB (strong signal)?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "SF7",
            "targetSf\":7"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "12": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "Strong signals trigger ADR to drop to SF7 for maximum energy efficiency.",
              "recoveryPath": {
                "simplerExplanation": "Drops to SF7 for power savings.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "LoRaWAN Activation: Over-The-Air (OTAA) vs ABP & Session Keys",
    "overviewMetaphor": "OTAA vs ABP is a Secure Bank Card Activation vs an Insecure Cash Envelope: ABP (Activation by Personalization) hardcodes permanent session keys into factory firmware (If an attacker extracts the key from one sensor, they decrypt all past and future traffic forever!); OTAA (Over-The-Air Activation) uses a single secret root key (`AppKey`) to perform a dynamic cryptographic handshake (Every time the device powers on, it negotiates fresh unique 128-bit session keys: `NwkSKey` for network integrity and `AppSKey` for end-to-end payload encryption).",
    "blocks": [
      {
        "id": "iotnet-d10-b1-otaa-join-procedure-cryptography",
        "day": 10,
        "blockNumber": 1,
        "title": "OTAA Join-Request / Join-Accept Handshake & Key Derivation",
        "conceptBudget": {
          "primaryConcept": "OTAA Join Procedure",
          "supportingTerms": [
            "Root Key: `AppKey` (128-bit AES master key stored in secure element)",
            "Identifiers: `JoinEUI` / `AppEUI` + `DevEUI`",
            "Join-Request (`DevEUI`, `JoinEUI`, `DevNonce`, signed with `MIC`)",
            "Join-Accept (Encrypted with `AppKey`, contains `AppNonce`, `NetID`, `DevAddr`)",
            "Derived Session Keys: $\\text{NwkSKey} = \\text{AES}_{\\text{AppKey}}(\\dots)$, $\\text{AppSKey} = \\text{AES}_{\\text{AppKey}}(\\dots)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d9-b1-star-of-stars-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "LoRaWAN OTAA Join Cryptographic Handshake",
              "nodes": [
                {
                  "id": "1",
                  "label": "Node transmits unencrypted Join-Request with DevNonce & MIC (signed by AppKey)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Join Server verifies DevNonce was never used before (Replay defense)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Join Server generates AppNonce -> Encrypts Join-Accept with AppKey -> Sends downlink",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Both sides derive matching NwkSKey & AppSKey -> Secure session activated!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "otaa_handshake_demo.js",
            "initialCode": "function deriveSessionKeys(appKey, appNonce, devNonce, netId) {\n  return {\n    nwkSKey: `AES128_NwkSKey_${appNonce}_${devNonce}`,\n    appSKey: `AES128_AppSKey_${appNonce}_${devNonce}`,\n    devAddr: `0x${netId.slice(0, 2)}123456`,\n    status: 'OTAA_SESSION_ACTIVATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(deriveSessionKeys('0x0123456789abcdef', 'A1B2C3', '0001', '000013')));",
            "expectedOutput": "{\"nwkSKey\":\"AES128_NwkSKey_A1B2C3_0001\",\"appSKey\":\"AES128_AppSKey_A1B2C3_0001\",\"devAddr\":\"0x00123456\",\"status\":\"OTAA_SESSION_ACTIVATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful cryptographic session activation following an OTAA Join-Accept?",
          "expectedStringOutput": "OTAA_SESSION_ACTIVATED_NOMINAL",
          "acceptableAnswers": [
            "OTAA_SESSION_ACTIVATED_NOMINAL",
            "status\":\"OTAA_SESSION_ACTIVATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
              "errorExplanation": "Matches OTAA_SESSION_ACTIVATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches OTAA_SESSION_ACTIVATED_NOMINAL.",
                "guidedFixPrompt": "Type OTAA_SESSION_ACTIVATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d10-b2-devnonce-replay-protection",
        "day": 10,
        "blockNumber": 2,
        "title": "DevNonce Replay Protection & Frame Counter Synchronization",
        "conceptBudget": {
          "primaryConcept": "DevNonce Replay Defense",
          "supportingTerms": [
            "`DevNonce` (2-byte counter generated by device on every Join-Request)",
            "Join Server DevNonce History Table (Strictly rejects any previously used `DevNonce` to block join replays)",
            "Frame Counters (`FCntUp`, `FCntDown` incremented with every packet)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d10-b1-otaa-join-procedure-cryptography",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Reused DevNonce Bug vs Monotonic Counter Fix Diff",
              "brokenCode": "// ❌ STATIC / RANDOM NONCE BUG (Join Replay Vulnerability):\nuint16_t devNonce = rand() % 100; // Can repeat randomly -> Join Server rejects connection!",
              "fixedCode": "// ✅ STRICT MONOTONIC DEVICENONCE (LoRaWAN 1.0.4+ Standard):\nuint16_t devNonce = eeprom_read_and_increment_nonce(); // Strictly incremented across reboots!",
              "errorLine": 2,
              "errorReason": "Reusing a previously seen DevNonce violates LoRaWAN specifications and causes the Join Server to silently drop the request.",
              "fixExplanation": "Persist and increment DevNonce in non-volatile memory on every join attempt."
            }
          },
          {
            "type": "runnable_code",
            "filename": "devnonce_eval_demo.js",
            "initialCode": "function evaluateJoinRequest(usedNonces, incomingNonce) {\n  if (usedNonces.has(incomingNonce)) {\n    return 'JOIN_REJECTED: DEVICENONCE_ALREADY_USED_REPLAY_DEFENSE';\n  }\n  usedNonces.add(incomingNonce);\n  return 'JOIN_ACCEPTED: FRESH_NONCE_VERIFIED';\n}\n\nconst history = new Set([1, 2, 3]);\nconsole.log(evaluateJoinRequest(history, 4));\nconsole.log(evaluateJoinRequest(history, 2)); // Replay attempt",
            "expectedOutput": "JOIN_ACCEPTED: FRESH_NONCE_VERIFIED\nJOIN_REJECTED: DEVICENONCE_ALREADY_USED_REPLAY_DEFENSE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why will a LoRaWAN Join Server reject a Join-Request containing a `DevNonce` of 2 if that same device previously joined with `DevNonce` 2?",
          "options": [
            "Because DevNonce must be strictly unique for every join attempt; reusing a past DevNonce is rejected to prevent malicious actors from recording and replaying old join packets to hijack the session",
            "Because DevNonce must always be an odd number",
            "To reset the gateway"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
              "errorExplanation": "Unique DevNonces prevent replay attacks on the join server.",
              "recoveryPath": {
                "simplerExplanation": "Prevents replay attacks by requiring unique nonces.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d10-b3-abp-security-hazards",
        "day": 10,
        "blockNumber": 3,
        "title": "Activation By Personalization (ABP) Pitfalls: Frame Counter Resets",
        "conceptBudget": {
          "primaryConcept": "ABP Security Pitfalls",
          "supportingTerms": [
            "Hardcoded Keys (`DevAddr`, `NwkSKey`, `AppSKey` baked into firmware)",
            "Frame Counter Reset Flaw (When battery dies, `FCnt` resets to 0; Network Server drops all packets because `FCnt <= lastFCnt`!)",
            "Key Compromise Hazard (Zero forward secrecy)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d10-b2-devnonce-replay-protection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "abp_reset_demo.js",
            "initialCode": "function evaluateAbpPacket(serverLastFcnt, incomingFcnt) {\n  return (incomingFcnt > serverLastFcnt)\n    ? 'PACKET_ACCEPTED: FRAME_COUNTER_VALID'\n    : 'PACKET_SILENTLY_DROPPED: FRAME_COUNTER_RESET_AFTER_REBOOT';\n}\n\nconsole.log(evaluateAbpPacket(500, 501));\nconsole.log(evaluateAbpPacket(500, 1)); // Device rebooted, counter reset to 1",
            "expectedOutput": "PACKET_ACCEPTED: FRAME_COUNTER_VALID\nPACKET_SILENTLY_DROPPED: FRAME_COUNTER_RESET_AFTER_REBOOT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What happens on a LoRaWAN Network Server when an ABP device reboots and transmits with `FCnt = 1` while the server expects `FCnt > 500`?",
          "expectedStringOutput": "PACKET_SILENTLY_DROPPED: FRAME_COUNTER_RESET_AFTER_REBOOT",
          "acceptableAnswers": [
            "PACKET_SILENTLY_DROPPED: FRAME_COUNTER_RESET_AFTER_REBOOT",
            "PACKET_SILENTLY_DROPPED",
            "Dropped"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
          "diagnosisMap": {
            "ACCEPTED": {
              "misconceptionId": "MC_IOTNET_LORAWAN_OTAA_VS_ABP_SESSION_KEYS",
              "errorExplanation": "Frame counters lower than server state are dropped to prevent replay attacks.",
              "recoveryPath": {
                "simplerExplanation": "Reboot counter reset causes packets to be silently dropped.",
                "guidedFixPrompt": "Type PACKET_SILENTLY_DROPPED: FRAME_COUNTER_RESET_AFTER_REBOOT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "LoRaWAN Device Classes: Class A, Class B & Class C",
    "overviewMetaphor": "LoRaWAN Device Classes are three mail delivery schedules: Class A (Battery Hermit) only checks the mailbox for 1 second immediately after dropping off outgoing mail (If the postman has incoming mail, they can only deliver it during that 1-second reply window; lowest battery power!); Class B (Appointment Keeper) opens the mailbox at pre-scheduled clock ticks synchronized by radio beacons; Class C (24/7 Security Desk) leaves the mailbox wide open continuously, listening for instant commands, but requires plugged-in wall power.",
    "blocks": [
      {
        "id": "iotnet-d11-b1-class-a-rx-window-timing",
        "day": 11,
        "blockNumber": 1,
        "title": "Class A Operation: RX1 & RX2 Receive Window Timing",
        "conceptBudget": {
          "primaryConcept": "Class A RX Window Architecture",
          "supportingTerms": [
            "Class A Invariant (Every device must support Class A; strictly uplink-driven)",
            "`RECEIVE_DELAY1` (Typically 1.0s after uplink end $\\implies$ opens RX1 on uplink frequency)",
            "`RECEIVE_DELAY2` (Typically 2.0s after uplink end $\\implies$ opens RX2 on fixed default frequency 869.525 MHz / SF9)",
            "Lowest power consumption ($< 2\\text{ uA}$ sleep current)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d10-b1-otaa-join-procedure-cryptography",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Class A RX Window Timeline",
              "boxes": [
                {
                  "label": "1. Uplink Transmission",
                  "value": "Node transmits payload for ToA duration (e.g. 50 ms) -> Shuts RF radio off",
                  "varType": "TX Active",
                  "isUpdated": false
                },
                {
                  "label": "2. RX1 Window (+1.00s)",
                  "value": "Radio wakes for ~150 ms listening on uplink channel with same Data Rate",
                  "varType": "RX1 Slot",
                  "isUpdated": false
                },
                {
                  "label": "3. RX2 Window (+2.00s)",
                  "value": "If no preamble heard in RX1, wakes for RX2 on fixed frequency (869.525 MHz SF9)",
                  "varType": "RX2 Slot",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "class_a_timing_demo.js",
            "initialCode": "function calculateRxWindows(txEndMs, rx1Delay = 1000, rx2Delay = 2000) {\n  return {\n    rx1OpenTimestampMs: txEndMs + rx1Delay,\n    rx2OpenTimestampMs: txEndMs + rx2Delay,\n    windowDurationMs: 150,\n    protocolClass: 'CLASS_A_UPLINK_TRIGGERED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRxWindows(5000)));",
            "expectedOutput": "{\"rx1OpenTimestampMs\":6000,\"rx2OpenTimestampMs\":7000,\"windowDurationMs\":150,\"protocolClass\":\"CLASS_A_UPLINK_TRIGGERED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "At what millisecond timestamp does the RX1 receive window open if an uplink completes at timestamp 5,000 ms with standard 1,000 ms delay?",
          "expectedStringOutput": "6000",
          "acceptableAnswers": [
            "6000",
            "6000 ms",
            "rx1OpenTimestampMs\":6000"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
          "diagnosisMap": {
            "7000": {
              "misconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
              "errorExplanation": "7000 ms is RX2 (+2000 ms). RX1 opens at 5000 + 1000 = 6000 ms.",
              "recoveryPath": {
                "simplerExplanation": "5000 + 1000 = 6000 ms.",
                "guidedFixPrompt": "Type 6000"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d11-b2-class-b-beacon-synchronization",
        "day": 11,
        "blockNumber": 2,
        "title": "Class B Operation: Gateway Beacon Synchronization & Ping Slots",
        "conceptBudget": {
          "primaryConcept": "Class B Beaconing",
          "supportingTerms": [
            "Gateway Beacon (Transmitted every 128 seconds with GPS time sync)",
            "Ping Slots (Periodic receive slots scheduled within the 128s beacon epoch)",
            "Deterministic downlink latency with moderate battery drain"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d11-b1-class-a-rx-window-timing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "class_b_demo.js",
            "initialCode": "function evaluateClassBPeriodicity(beaconIntervalSec = 128, pingPeriodicity = 32) {\n  const slotsPerEpoch = beaconIntervalSec / pingPeriodicity;\n  return {\n    beaconIntervalSeconds: beaconIntervalSec,\n    pingSlotIntervalSeconds: pingPeriodicity,\n    pingSlotsPerEpoch: slotsPerEpoch,\n    maxDownlinkLatencySec: pingPeriodicity,\n    deviceClass: 'CLASS_B_BEACON_SYNCHRONIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateClassBPeriodicity(128, 32)));",
            "expectedOutput": "{\"beaconIntervalSeconds\":128,\"pingSlotIntervalSeconds\":32,\"pingSlotsPerEpoch\":4,\"maxDownlinkLatencySec\":32,\"deviceClass\":\"CLASS_B_BEACON_SYNCHRONIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard gateway beacon interval duration (in seconds) in LoRaWAN Class B networks?",
          "expectedStringOutput": "128",
          "acceptableAnswers": [
            "128",
            "128 seconds",
            "128s"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
              "errorExplanation": "LoRaWAN Class B beacons are broadcast every 128 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Standard beacon interval is 128 seconds.",
                "guidedFixPrompt": "Type 128"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d11-b3-class-c-continuous-listening",
        "day": 11,
        "blockNumber": 3,
        "title": "Class C Operation: Continuous Listening & Actuator Control",
        "conceptBudget": {
          "primaryConcept": "Class C Continuous Listening",
          "supportingTerms": [
            "Continuous RX2 Listening (Receiver remains powered 100% of the time, closing only while transmitting uplinks)",
            "Zero Downlink Latency (Instant valve/relay actuation)",
            "Mains Power Requirement ($15-20\\text{ mA}$ continuous current drains battery in 3 days)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d11-b2-class-b-beacon-synchronization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LoRaWAN Classes Trade-off Matrix",
              "boxes": [
                {
                  "label": "Class A (Battery)",
                  "value": "Downlink: ONLY after uplink | Latency: High | Battery Life: 5 - 10 YEARS (2 uA)",
                  "varType": "Battery Class",
                  "isUpdated": false
                },
                {
                  "label": "Class B (Beacon)",
                  "value": "Downlink: Periodic ping slots | Latency: 1 - 32s | Battery Life: 2 - 4 YEARS",
                  "varType": "Hybrid Class",
                  "isUpdated": false
                },
                {
                  "label": "Class C (Mains)",
                  "value": "Downlink: CONTINUOUS (Instant) | Latency: < 50 ms | Battery Life: MAINS POWER ONLY (20 mA)",
                  "varType": "Mains Class",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "class_c_eval_demo.js",
            "initialCode": "function selectLoraClass(isMainsPowered, requiresInstantDownlink) {\n  if (isMainsPowered && requiresInstantDownlink) {\n    return 'CLASS_C: CONTINUOUS_LISTENING_FOR_INSTANT_ACTUATION';\n  }\n  return 'CLASS_A: ULTRA_LOW_POWER_BATTERY_DRIVEN';\n}\n\nconsole.log(selectLoraClass(true, true));\nconsole.log(selectLoraClass(false, false));",
            "expectedOutput": "CLASS_C: CONTINUOUS_LISTENING_FOR_INSTANT_ACTUATION\nCLASS_A: ULTRA_LOW_POWER_BATTERY_DRIVEN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which LoRaWAN device class should be selected for a mains-powered smart street light controller requiring sub-second turn-on commands from the city dashboard?",
          "options": [
            "Class C (Continuous listening provides instant zero-latency downlink execution, acceptable because the street light is wired to permanent mains power)",
            "Class A",
            "Class D"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_LORAWAN_CLASS_A_B_C_UPLINK_DOWNLINK",
              "errorExplanation": "Class A cannot receive downlinks on-demand without an uplink first.",
              "recoveryPath": {
                "simplerExplanation": "Class C is required for instant downlinks.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Time-on-Air (ToA) & Regional Duty Cycle Regulations",
    "overviewMetaphor": "Time-on-Air (ToA) is a strict telephone talk-time quota in a shared office: in Europe (ETSI), the telecommunications authority enforces a 1% Duty Cycle rule (You are legally allowed to speak on the radio for at most 36 seconds per hour: $3600\\text{s} \\times 1\\%$); transmitting a 20-byte payload at SF7 takes only 45 milliseconds (You can send 800 packets/hour!); but transmitting that same payload at SF12 takes 1.4 seconds (You can send only 25 packets/hour before breaking the law and having your device banned).",
    "blocks": [
      {
        "id": "iotnet-d12-b1-toa-formula-and-symbol-count",
        "day": 12,
        "blockNumber": 1,
        "title": "Exact Time-on-Air (ToA) Mathematical Formula",
        "conceptBudget": {
          "primaryConcept": "Time-on-Air (ToA) Calculation",
          "supportingTerms": [
            "Preamble Duration ($T_{\\text{preamble}} = (N_{\\text{preamble}} + 4.25) \\times T_s$)",
            "Payload Symbol Count formula ($N_{\\text{payload}} = 8 + \\max\\left(\\lceil \\frac{8\\text{PL} - 4\\text{SF} + 28 + 16 - 20\\text{IH}}{4(\\text{SF} - 2\\text{DE})} \\rceil \\times (\\text{CR} + 4), 0\\right)$)",
            "Low Data Rate Optimization (`DE = 1` for SF11 and SF12 at 125 kHz)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d8-b2-spreading-factors-and-symbol-duration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Semtech LoRa ToA Payload Symbol Formula",
            "codeSnippet": "// Parameters:\n// PL = Payload bytes | SF = Spreading factor (7..12) | CR = Coding rate (1..4 for 4/5..4/8)\n// IH = Implicit header (0 = explicit, 1 = implicit) | DE = Low data rate opt (1 for SF11/12 @ 125k)\nconst num = 8 * PL - 4 * SF + 28 + 16 - 20 * IH;\nconst denom = 4 * (SF - 2 * DE);\nconst payloadSymbols = 8 + Math.max(Math.ceil(num / denom) * (CR + 4), 0);",
            "lineNotes": {
              "4": "Calculates payload symbol count taking into account FEC coding rate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "toa_comparison_demo.js",
            "initialCode": "function calculateToaMs(sf, plBytes = 20, bw = 125000) {\n  const tsMs = (Math.pow(2, sf) / bw) * 1000;\n  const tPreamble = (8 + 4.25) * tsMs;\n  const de = sf >= 11 ? 1 : 0;\n  const num = 8 * plBytes - 4 * sf + 28 + 16;\n  const denom = 4 * (sf - 2 * de);\n  const payloadSyms = 8 + Math.max(Math.ceil(num / denom) * 5, 0);\n  const totalMs = tPreamble + payloadSyms * tsMs;\n  return {\n    spreadingFactor: `SF${sf}`,\n    payloadBytes: plBytes,\n    timeOnAirMs: Number(totalMs.toFixed(1)),\n    packetsPerHourMaxAt1Percent: Math.floor(36000 / totalMs)\n  };\n}\n\nconsole.log(JSON.stringify(calculateToaMs(7, 20)));\nconsole.log(JSON.stringify(calculateToaMs(12, 20)));",
            "expectedOutput": "{\"spreadingFactor\":\"SF7\",\"payloadBytes\":20,\"timeOnAirMs\":56.6,\"packetsPerHourMaxAt1Percent\":636}\n{\"spreadingFactor\":\"SF12\",\"payloadBytes\":20,\"timeOnAirMs\":1482.8,\"packetsPerHourMaxAt1Percent\":24}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many maximum 20-byte packets per hour can legally be sent at SF7 under Europe's 1% duty cycle limit (36,000 ms / 56.6 ms)?",
          "expectedStringOutput": "636",
          "acceptableAnswers": [
            "636",
            "636 packets",
            "packetsPerHourMaxAt1Percent\":636"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "24": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "24 packets is the limit for SF12. SF7 allows 636 packets/hour.",
              "recoveryPath": {
                "simplerExplanation": "SF7 allows 636 packets per hour.",
                "guidedFixPrompt": "Type 636"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d12-b2-etsi-vs-fcc-regional-regulations",
        "day": 12,
        "blockNumber": 2,
        "title": "Regional Telecommunications Compliance: ETSI vs FCC",
        "conceptBudget": {
          "primaryConcept": "Regional RF Duty Regulations",
          "supportingTerms": [
            "EU868 (ETSI: 1% Duty Cycle = 36s/hr in sub-bands g1, g2; +14 dBm ERP limit)",
            "US915 (FCC: Zero duty cycle limit, but 400 ms maximum Dwell Time per hop; +30 dBm limit)",
            "Frequency Hopping Spread Spectrum (FHSS) compliance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d12-b1-toa-formula-and-symbol-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EU868 vs US915 Regulatory Differences",
              "boxes": [
                {
                  "label": "EU868 (Europe - ETSI)",
                  "value": "Channels: 8 channels | Duty Cycle: 1% (36s/hour) | Dwell Time: NONE | Max Tx: +14 dBm",
                  "varType": "ETSI Rules",
                  "isUpdated": false
                },
                {
                  "label": "US915 (USA - FCC)",
                  "value": "Channels: 64 + 8 channels | Duty Cycle: NONE | Dwell Time: Max 400 ms per hop | Max Tx: +30 dBm",
                  "varType": "FCC Rules",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "regional_rules_demo.js",
            "initialCode": "function evaluateRegionalCompliance(region, toaMs) {\n  if (region === 'US915' && toaMs > 400) {\n    return 'VIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS';\n  }\n  return 'REGION_COMPLIANCE_NOMINAL';\n}\n\nconsole.log(evaluateRegionalCompliance('US915', 350));\nconsole.log(evaluateRegionalCompliance('US915', 1200)); // SF12 packet in US915!",
            "expectedOutput": "REGION_COMPLIANCE_NOMINAL\nVIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What regulatory status is triggered in the US915 region if an unfragmented SF12 packet takes 1200 ms Time-on-Air (exceeding the 400 ms limit)?",
          "expectedStringOutput": "VIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS",
          "acceptableAnswers": [
            "VIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS",
            "VIOLATION"
          ],
          "primaryMisconceptionId": "MC_IOTNET_TELECOMMUNICATION_REGULATORY_DUTY_LIMITS",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_IOTNET_TELECOMMUNICATION_REGULATORY_DUTY_LIMITS",
              "errorExplanation": "1200 ms exceeds the FCC 400 ms dwell time limit.",
              "recoveryPath": {
                "simplerExplanation": "Exceeds 400 ms -> VIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS.",
                "guidedFixPrompt": "Type VIOLATION_US_FCC_DWELL_TIME_EXCEEDED_400MS"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d12-b3-firmware-airtime-budget-tracker",
        "day": 12,
        "blockNumber": 3,
        "title": "Firmware Airtime Tracking & Leaky Bucket Rate Limiters",
        "conceptBudget": {
          "primaryConcept": "Firmware Airtime Budget Tracking",
          "supportingTerms": [
            "Leaky Bucket Airtime Tracker (Accumulates millisecond airtime on every TX)",
            "Leaking Rate ($36000\\text{ ms} / 3600\\text{s} = 10\\text{ ms/second}$)",
            "Preventing regulatory fines by holding transmission until budget recovers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d12-b2-etsi-vs-fcc-regional-regulations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "leaky_bucket_demo.js",
            "initialCode": "function evaluateAirtimeBudget(usedMs, maxMs = 36000) {\n  const availableMs = maxMs - usedMs;\n  return (availableMs > 100)\n    ? 'TRANSMISSION_PERMITTED_WITHIN_DUTY_CYCLE'\n    : 'TRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED';\n}\n\nconsole.log(evaluateAirtimeBudget(15000));\nconsole.log(evaluateAirtimeBudget(35950));",
            "expectedOutput": "TRANSMISSION_PERMITTED_WITHIN_DUTY_CYCLE\nTRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned by firmware when 35,950 ms of the 36,000 ms hourly airtime budget has been exhausted?",
          "expectedStringOutput": "TRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED",
          "acceptableAnswers": [
            "TRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED",
            "TRANSMISSION_PAUSED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_TELECOMMUNICATION_REGULATORY_DUTY_LIMITS",
          "diagnosisMap": {
            "PERMITTED": {
              "misconceptionId": "MC_IOTNET_TELECOMMUNICATION_REGULATORY_DUTY_LIMITS",
              "errorExplanation": "Only 50 ms remains, pausing transmission until the budget leaks.",
              "recoveryPath": {
                "simplerExplanation": "Budget exhausted -> TRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED.",
                "guidedFixPrompt": "Type TRANSMISSION_PAUSED_DUTY_CYCLE_EXHAUSTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Cellular IoT: NB-IoT (Narrowband) & LTE-M (Cat-M1)",
    "overviewMetaphor": "NB-IoT vs LTE-M is a Subterranean Water Probe vs an Armored Delivery Van: NB-IoT operates in a tiny 200 kHz bandwidth slot (Like water through a straw: it blasts +20 dB extra signal power to reach deep underground water meters beneath two basement concrete floors, but cannot handle voice or moving cars); LTE-M has 1.4 MHz bandwidth (Supports VoLTE emergency voice calling and seamless cell tower handovers while traveling 100 km/h in a truck).",
    "blocks": [
      {
        "id": "iotnet-d13-b1-nbiot-vs-ltem-technical-differences",
        "day": 13,
        "blockNumber": 1,
        "title": "NB-IoT vs LTE-M Architecture & PHY Comparison",
        "conceptBudget": {
          "primaryConcept": "NB-IoT vs LTE-M Trade-offs",
          "supportingTerms": [
            "NB-IoT (Cat-NB1/NB2: 200 kHz single PRB bandwidth, +20 dB Maximum Coupling Loss MCL 164 dB, zero voice/handover)",
            "LTE-M (Cat-M1: 1.4 MHz 6 PRBs, VoLTE voice support, full cell handover, up to 1 Mbps)",
            "Deployment Modes: In-band, Guard-band, Standalone"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cellular LPWAN Standards Comparison",
              "boxes": [
                {
                  "label": "1. NB-IoT (Narrowband)",
                  "value": "Bandwidth: 200 kHz | Max Speed: ~60 kbps | Link Budget: 164 dB MCL (+20dB penetration!) | Handover: NO (Re-attaches)",
                  "varType": "Deep Penetration",
                  "isUpdated": false
                },
                {
                  "label": "2. LTE-M (Cat-M1)",
                  "value": "Bandwidth: 1.4 MHz | Max Speed: ~1 Mbps | Link Budget: 156 dB MCL | Handover: YES (Moving vehicles) | Voice: VoLTE",
                  "varType": "Mobility & Speed",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cellular_selection_demo.js",
            "initialCode": "function selectCellularStandard(requiresMovingHandover, isDeepUnderground) {\n  if (requiresMovingHandover) return 'LTE_M: SEAMLESS_TOWER_HANDOVER_FOR_VEHICLE_FLEET';\n  if (isDeepUnderground) return 'NB_IOT: 164DB_MCL_DEEP_BASEMENT_PENETRATION';\n  return 'STANDARD_LTE_M';\n}\n\nconsole.log(selectCellularStandard(true, false));\nconsole.log(selectCellularStandard(false, true));",
            "expectedOutput": "LTE_M: SEAMLESS_TOWER_HANDOVER_FOR_VEHICLE_FLEET\nNB_IOT: 164DB_MCL_DEEP_BASEMENT_PENETRATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which cellular standard is selected for a stationary gas meter located deep in an underground concrete basement?",
          "expectedStringOutput": "NB_IOT: 164DB_MCL_DEEP_BASEMENT_PENETRATION",
          "acceptableAnswers": [
            "NB_IOT: 164DB_MCL_DEEP_BASEMENT_PENETRATION",
            "NB_IOT",
            "NB-IoT"
          ],
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "LTE_M": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "NB-IoT provides superior 164 dB MCL for deep basement penetration.",
              "recoveryPath": {
                "simplerExplanation": "NB-IoT is optimal for deep underground.",
                "guidedFixPrompt": "Type NB_IOT: 164DB_MCL_DEEP_BASEMENT_PENETRATION"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d13-b2-esim-and-m2m-remote-sim-provisioning",
        "day": 13,
        "blockNumber": 2,
        "title": "eSIM / eUICC (Embedded SIM) & GSMA M2M Remote Provisioning",
        "conceptBudget": {
          "primaryConcept": "eSIM / eUICC M2M Provisioning",
          "supportingTerms": [
            "eUICC (Hardware chip permanently soldered to PCB)",
            "GSMA SGP.02 M2M Remote SIM Provisioning",
            "SM-DP (Subscription Manager Data Preparation)",
            "Over-The-Air carrier profile switching without swapping physical plastic SIM cards"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d13-b1-nbiot-vs-ltem-technical-differences",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "esim_provision_demo.js",
            "initialCode": "function evaluateSimType(isSolderedEuicc) {\n  return isSolderedEuicc\n    ? 'EUICC_ESIM: SOLDERED_MFF2_CHIP_REMOTE_OTA_CARRIER_SWITCHABLE'\n    : 'PLASTIC_SIM: PHYSICAL_SLOT_VIBRATION_FAILURE_RISK';\n}\n\nconsole.log(evaluateSimType(true));\nconsole.log(evaluateSimType(false));",
            "expectedOutput": "EUICC_ESIM: SOLDERED_MFF2_CHIP_REMOTE_OTA_CARRIER_SWITCHABLE\nPLASTIC_SIM: PHYSICAL_SLOT_VIBRATION_FAILURE_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are soldered eUICC chips (eSIM) preferred over traditional plastic SIM cards for industrial IoT devices?",
          "options": [
            "Because soldered MFF2 chips eliminate physical SIM socket contacts that corrode and fail under vibration, while allowing carrier profile updates over-the-air across global deployments",
            "Because plastic SIM cards cannot store phone numbers",
            "To save 1 milliwatt of solar power"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "eSIMs eliminate mechanical socket failures and enable remote carrier switching.",
              "recoveryPath": {
                "simplerExplanation": "Vibration-proof and supports OTA profile switching.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d13-b3-coverage-enhancement-modes",
        "day": 13,
        "blockNumber": 3,
        "title": "Coverage Enhancement (CE) Modes & Repetition Coding",
        "conceptBudget": {
          "primaryConcept": "Coverage Enhancement (CE) Repetitions",
          "supportingTerms": [
            "CE Levels: CE Level 0 (Normal: 0 dB gain), CE Level 1 (+10 dB), CE Level 2 (+20 dB)",
            "Subframe Repetitions (Repeating same packet up to 128 times for energy accumulation at receiver)",
            "Battery trade-off: Deep penetration repetitions increase transmit power by 10x"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d13-b2-esim-and-m2m-remote-sim-provisioning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ce_repetitions_demo.js",
            "initialCode": "function calculateCeEnergyCost(ceLevel) {\n  const repetitions = (ceLevel === 0) ? 1 : (ceLevel === 1 ? 16 : 128);\n  const energyMilliJoules = repetitions * 2.5;\n  return {\n    ceLevel,\n    packetRepetitions: repetitions,\n    txEnergyMj: energyMilliJoules,\n    status: 'COVERAGE_ENHANCEMENT_PACKED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCeEnergyCost(0)));\nconsole.log(JSON.stringify(calculateCeEnergyCost(2))); // Max CE",
            "expectedOutput": "{\"ceLevel\":0,\"packetRepetitions\":1,\"txEnergyMj\":2.5,\"status\":\"COVERAGE_ENHANCEMENT_PACKED\"}\n{\"ceLevel\":2,\"packetRepetitions\":128,\"txEnergyMj\":320,\"status\":\"COVERAGE_ENHANCEMENT_PACKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many packet repetitions are transmitted under maximum NB-IoT Coverage Enhancement Level 2?",
          "expectedStringOutput": "128",
          "acceptableAnswers": [
            "128",
            "128 repetitions",
            "packetRepetitions\":128"
          ],
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "16": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "16 is for CE Level 1. CE Level 2 uses 128 repetitions.",
              "recoveryPath": {
                "simplerExplanation": "CE Level 2 uses 128 repetitions.",
                "guidedFixPrompt": "Type 128"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Cellular Power Saving Modes: PSM & eDRX Timers",
    "overviewMetaphor": "Cellular Power Modes are a Cell Phone Sleeping in a Drawer: in regular phone mode, the phone continuously searches for cell towers every 1.28 seconds (Drains battery in 24 hours!); in eDRX (Extended Discontinuous Reception), the modem checks for incoming calls only once every 40 seconds; in PSM (Power Saving Mode), the device registers with the tower, enters a coma for 24 hours drawing only 3 microamps (0.003 mA!), and wakes up tomorrow without needing to perform an expensive 5-second network re-attachment handshake.",
    "blocks": [
      {
        "id": "iotnet-d14-b1-psm-timers-t3324-t3412",
        "day": 14,
        "blockNumber": 1,
        "title": "PSM Timers: T3324 Active Timer vs T3412 Periodic TAU",
        "conceptBudget": {
          "primaryConcept": "PSM Timers Invariant",
          "supportingTerms": [
            "Power Saving Mode (PSM: 3GPP Rel-12 feature ~3 uA current)",
            "T3324 Active Timer (Device remains reachable in idle mode for downlink paging, e.g. 10 seconds)",
            "T3412 Extended Periodic TAU (Periodic Tracking Area Update sleep timer, up to 413 days!)",
            "Retaining IP address & NAS security context during deep sleep"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d13-b1-nbiot-vs-ltem-technical-differences",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cellular PSM State Machine Timeline",
              "boxes": [
                {
                  "label": "1. Active Connected",
                  "value": "Duration: 2 - 5s | Current: 100 - 200 mA | Transmits sensor payload to cloud",
                  "varType": "Active State",
                  "isUpdated": false
                },
                {
                  "label": "2. T3324 Active Idle",
                  "value": "Duration: 10s | Current: 15 mA | Listens for incoming paging downlinks",
                  "varType": "Paging Window",
                  "isUpdated": false
                },
                {
                  "label": "3. T3412 PSM Deep Sleep",
                  "value": "Duration: Hours / Days | Current: 3.5 uA (0.0035 mA!) | Radio off, context saved",
                  "varType": "Deep Sleep State",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "psm_timers_demo.js",
            "initialCode": "function evaluatePsmTimers(t3324Sec, t3412Hours) {\n  return {\n    reachableWindowSeconds: t3324Sec,\n    deepSleepDurationHours: t3412Hours,\n    sleepCurrentUa: 3.5,\n    networkContextRetained: true,\n    status: 'PSM_CONFIGURED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePsmTimers(10, 24)));",
            "expectedOutput": "{\"reachableWindowSeconds\":10,\"deepSleepDurationHours\":24,\"sleepCurrentUa\":3.5,\"networkContextRetained\":true,\"status\":\"PSM_CONFIGURED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical deep sleep current (in microamps, uA) drawn by a cellular modem in 3GPP Power Saving Mode (PSM)?",
          "expectedStringOutput": "3.5",
          "acceptableAnswers": [
            "3.5",
            "3.5 uA",
            "3.5uA",
            "sleepCurrentUa\":3.5",
            "3-4 uA"
          ],
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "15 mA is for T3324 idle mode. PSM deep sleep is ~3.5 uA.",
              "recoveryPath": {
                "simplerExplanation": "PSM sleep current is ~3.5 uA.",
                "guidedFixPrompt": "Type 3.5"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d14-b2-edrx-paging-cycle-tradeoffs",
        "day": 14,
        "blockNumber": 2,
        "title": "Extended Discontinuous Reception (eDRX): Downlink Responsiveness",
        "conceptBudget": {
          "primaryConcept": "eDRX Paging Cycles",
          "supportingTerms": [
            "eDRX Cycle (Paging Time Window PTW every 5.12s, 10.24s, 20.48s, up to 40.96 minutes)",
            "Use Case: Devices that require periodic downlinks without transmitting uplinks first (e.g. smart locks, streetlights)",
            "Energy trade-off vs PSM"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d14-b1-psm-timers-t3324-t3412",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "edrx_calc_demo.js",
            "initialCode": "function evaluateEdrxInterval(cycleSec) {\n  const avgCurrentMa = (0.2 / cycleSec) * 20 + ((cycleSec - 0.2) / cycleSec) * 0.02;\n  return {\n    edrxCycleSeconds: cycleSec,\n    maxDownlinkLatencySec: cycleSec,\n    estimatedAverageCurrentMa: Number(avgCurrentMa.toFixed(3)),\n    profile: 'EDRX_PERIODIC_PAGING'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEdrxInterval(20.48)));",
            "expectedOutput": "{\"edrxCycleSeconds\":20.48,\"maxDownlinkLatencySec\":20.48,\"estimatedAverageCurrentMa\":0.215,\"profile\":\"EDRX_PERIODIC_PAGING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should an IoT engineer choose eDRX over PSM for a cellular deployment?",
          "options": [
            "When the cloud must be able to initiate downlink commands to the device within a predictable latency window (e.g. 20 seconds) without waiting for the device to wake up hours later on a periodic uplink",
            "When battery life does not matter at all",
            "To disable GPS"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "eDRX provides periodic paging listening windows for server-initiated downlinks.",
              "recoveryPath": {
                "simplerExplanation": "Enables server-initiated downlinks within seconds.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d14-b3-battery-lifecycle-ten-year-goal",
        "day": 14,
        "blockNumber": 3,
        "title": "10-Year Battery Life Mathematical Modeling & LiSOCl2 Self-Discharge",
        "conceptBudget": {
          "primaryConcept": "10-Year Battery Mathematical Model",
          "supportingTerms": [
            "Battery Chemistry: Lithium Thionyl Chloride ($\\text{LiSOCl}_2$ with $< 1\\%$ annual self-discharge)",
            "Daily Energy Budget Formula ($E_{\\text{day}} = I_{\\text{active}} T_{\\text{active}} + I_{\\text{sleep}} T_{\\text{sleep}}$)",
            "Passivation layer depassivation current pulses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d14-b2-edrx-paging-cycle-tradeoffs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "battery_model_demo.js",
            "initialCode": "function calculateBatteryYears(capacityMah, activeMa, activeSecPerDay, sleepUa = 3.5, selfDischargePct = 1.0) {\n  const activeMah = activeMa * (activeSecPerDay / 3600);\n  const sleepMah = (sleepUa / 1000) * ((86400 - activeSecPerDay) / 3600);\n  const dailyMah = activeMah + sleepMah;\n  const yearlyMah = dailyMah * 365.25;\n  const effectiveCapacity = capacityMah * (1 - (selfDischargePct / 100) * 10); // 10-year self-discharge factor\n  const years = effectiveCapacity / yearlyMah;\n  return {\n    capacityMah,\n    dailyConsumptionMah: Number(dailyMah.toFixed(4)),\n    estimatedYears: Number(years.toFixed(1)),\n    achievesTenYears: years >= 10.0\n  };\n}\n\nconsole.log(JSON.stringify(calculateBatteryYears(8500, 120, 5, 3.5, 1.0))); // 8500mAh D-cell",
            "expectedOutput": "{\"capacityMah\":8500,\"dailyConsumptionMah\":0.2504,\"estimatedYears\":83.8,\"achievesTenYears\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does an 8500 mAh battery consuming 0.2504 mAh/day satisfy the 10-year cellular battery life requirement?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "YES",
            "achievesTenYears\":true"
          ],
          "primaryMisconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_IOTNET_NBIOT_LTE_M_E_DRX_PSM_BATTERY_LIFECYCLE",
              "errorExplanation": "0.2504 mAh/day yields over 80 years of nominal capacity, easily exceeding 10 years.",
              "recoveryPath": {
                "simplerExplanation": "8500 mAh exceeds 10-year goal.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign long-range communication engine: 1. OTAA cryptographic join handshake and AES session key derivation; 2. Strict Time-on-Air (ToA) European 1% duty cycle limiter; 3. Class A downlinks scheduled in precise millisecond RX1/RX2 windows; 4. Cellular NB-IoT PSM power-saving profile configuration; 5. Verification of 10-year battery life invariants.",
    "blocks": [
      {
        "id": "iotnet-d15-b1-lpwan-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Long-Range LPWAN Telemetry Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "LPWAN Long-Range Telemetry Synthesis",
          "supportingTerms": [
            "LoRaWAN OTAA Stack",
            "Airtime Duty Limiter",
            "Cellular PSM Modem Controller",
            "Multi-Protocol Radio Invariants"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d14-b1-psm-timers-t3324-t3412",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Unified LPWAN Telemetry Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Sensor samples industrial environmental telemetry",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "LoRaWAN OTAA engine verifies duty cycle airtime budget (ETSI 1%)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Cellular backup modem manages PSM timers (T3324 / T3412)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Encrypted payload transmitted to Cloud IoT Core -> 10-Year Battery Verified!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lpwan_engine_demo.js",
            "initialCode": "function runLpwanEngine() {\n  return {\n    loraOtaaStatus: 'OTAA_KEYS_DERIVED_AUTHENTIC',\n    airtimeLimiter: 'DUTY_CYCLE_LEAKY_BUCKET_ACTIVE',\n    cellularPsmModem: 'PSM_DEEP_SLEEP_3.5UA_VERIFIED',\n    engineStatus: 'LPWAN_TELEMETRY_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runLpwanEngine().engineStatus);",
            "expectedOutput": "LPWAN_TELEMETRY_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Long-Range LPWAN Telemetry Engine?",
          "expectedStringOutput": "LPWAN_TELEMETRY_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "LPWAN_TELEMETRY_ENGINE_ACTIVE",
            "engineStatus: LPWAN_TELEMETRY_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "Matches LPWAN_TELEMETRY_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches LPWAN_TELEMETRY_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type LPWAN_TELEMETRY_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d15-b2-lpwan-power-compliance-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "LPWAN Power Consumption & Regulatory Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "LPWAN Power & Regulatory Audit",
          "supportingTerms": [
            "ETSI 1% Duty Limit Verification",
            "FCC Dwell Time Invariant",
            "Zero Battery Depletion Hazard"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d15-b1-lpwan-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lpwan_audit_demo.js",
            "initialCode": "function auditLpwanSystem(dutyCompliant, batteryYears) {\n  const passed = dutyCompliant && (batteryYears >= 10.0);\n  return {\n    dutyCompliant,\n    batteryYears,\n    auditGrade: passed ? 'LPWAN_SYSTEM_AUDIT_PASSED' : 'DEFECTS_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditLpwanSystem(true, 12.5)));",
            "expectedOutput": "{\"dutyCompliant\":true,\"batteryYears\":12.5,\"auditGrade\":\"LPWAN_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when duty cycle compliance is 100% and battery runtime exceeds 10 years?",
          "expectedStringOutput": "LPWAN_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "LPWAN_SYSTEM_AUDIT_PASSED",
            "auditGrade\":\"LPWAN_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "All checks passed awards LPWAN_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards LPWAN_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type LPWAN_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d15-b3-milestone2-iotnet-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Long-Range LPWAN Telemetry Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "LPWAN Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d15-b2-lpwan-power-compliance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_iotnet_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_LORAWAN_SPREADING_FACTOR_AIRTIME_REGULATION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete LoRaWAN / Cellular LPWAN Long-Range Telemetry Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "CoAP (Constrained Application Protocol) & UDP REST",
    "overviewMetaphor": "CoAP is an ultra-lightweight REST API designed for constrained microcontrollers: HTTP sends bloated 500-byte ASCII text headers over heavy TCP handshakes; CoAP replaces this with a 4-byte binary header over lightweight UDP; a GET request for `/sensors/temp` is packed into just 12 bytes total; it supports asynchronous subscriptions (Observe option) and can run in Confirmable (CON with ACK) or Non-Confirmable (NON) modes.",
    "blocks": [
      {
        "id": "iotnet-d16-b1-coap-4byte-binary-header",
        "day": 16,
        "blockNumber": 1,
        "title": "CoAP (RFC 7252) 4-Byte Binary Header Bitfields",
        "conceptBudget": {
          "primaryConcept": "CoAP 4-Byte Binary Header",
          "supportingTerms": [
            "Version (2 bits: `01b`)",
            "Type (2 bits: `00` CON, `01` NON, `10` ACK, `11` RST)",
            "Token Length (TKL 4 bits: 0..8 bytes)",
            "Code (8 bits: 3-bit Class + 5-bit Detail, e.g. `0.01` GET, `2.05` Content)",
            "Message ID (16 bits for deduplication and matching ACKs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d2-b1-lwip-pbuf-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CoAP 4-Byte Header Bitfield Packing",
              "boxes": [
                {
                  "label": "Byte 0 (Bitfields)",
                  "value": "Bits 7..6: Ver (01) | Bits 5..4: Type (CON/NON) | Bits 3..0: Token Length (TKL)",
                  "varType": "Header Byte 0",
                  "isUpdated": false
                },
                {
                  "label": "Byte 1 (Code)",
                  "value": "Bits 7..5: Class (0=Request, 2=Success, 4=ClientErr) | Bits 4..0: Detail (01=GET, 02=POST)",
                  "varType": "Header Byte 1",
                  "isUpdated": false
                },
                {
                  "label": "Bytes 2 - 3 (MsgID)",
                  "value": "16-bit Message ID (e.g. 0x1234 for tracking retransmissions & matching ACKs)",
                  "varType": "Header Bytes 2-3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "coap_header_demo.js",
            "initialCode": "function packCoapHeader(typeCode, methodCode, msgId) {\n  const byte0 = (1 << 6) | ((typeCode & 3) << 4);\n  const byte1 = (methodCode === 'GET') ? 0x01 : 0x02;\n  const byte2 = (msgId >> 8) & 0xFF;\n  const byte3 = msgId & 0xFF;\n  return [byte0, byte1, byte2, byte3].map(b => b.toString(16).padStart(2, '0')).join('');\n}\n\nconsole.log('GET CON MsgID 0x1234:', packCoapHeader(0, 'GET', 0x1234));",
            "expectedOutput": "GET CON MsgID 0x1234: 40011234",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 4-byte hexadecimal string represents a CoAP Confirmable (CON) GET request with Message ID `0x1234`?",
          "expectedStringOutput": "40011234",
          "acceptableAnswers": [
            "40011234",
            "0x40011234"
          ],
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "00000000": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "Byte 0 is 0x40 (Ver 1, CON), Byte 1 is 0x01 (GET), Bytes 2-3 are 0x1234 -> 40011234.",
              "recoveryPath": {
                "simplerExplanation": "Packs into 40011234.",
                "guidedFixPrompt": "Type 40011234"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d16-b2-con-vs-non-retransmission-math",
        "day": 16,
        "blockNumber": 2,
        "title": "Confirmable (CON) Reliability & Exponential Backoff Math",
        "conceptBudget": {
          "primaryConcept": "CoAP CON Exponential Backoff",
          "supportingTerms": [
            "Confirmable (CON: Requires matching ACK with same Message ID)",
            "`ACK_TIMEOUT` (Default 2.0 seconds with random jitter)",
            "`ACK_RANDOM_FACTOR` (1.5)",
            "`MAX_RETRANSMIT` (4 attempts)",
            "Non-Confirmable (NON: Fire-and-forget for streaming telemetry)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d16-b1-coap-4byte-binary-header",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coap_backoff_demo.js",
            "initialCode": "function calculateCoapRetransmits(baseTimeoutSec = 2.0, maxRetries = 4) {\n  let totalWait = 0;\n  let currentTimeout = baseTimeoutSec;\n  const timeline = [];\n  for (let i = 0; i <= maxRetries; i++) {\n    timeline.push({ attempt: i, timeoutSec: currentTimeout });\n    totalWait += currentTimeout;\n    currentTimeout *= 2; // Exponential backoff\n  }\n  return { attempts: timeline, totalMaxWaitSeconds: totalWait };\n}\n\nconsole.log(JSON.stringify(calculateCoapRetransmits(2.0, 4)));",
            "expectedOutput": "{\"attempts\":[{\"attempt\":0,\"timeoutSec\":2},{\"attempt\":1,\"timeoutSec\":4},{\"attempt\":2,\"timeoutSec\":8},{\"attempt\":3,\"timeoutSec\":16},{\"attempt\":4,\"timeoutSec\":32}],\"totalMaxWaitSeconds\":62}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the timeout duration (in seconds) for retry attempt #2 under standard CoAP exponential backoff starting at 2.0s ($2 \\times 2^2$)?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8s",
            "8 seconds",
            "8.0"
          ],
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "Attempt 0 = 2s, Attempt 1 = 4s, Attempt 2 = 8s.",
              "recoveryPath": {
                "simplerExplanation": "Attempt 2 timeout is 8 seconds.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d16-b3-coap-observe-pubsub-option",
        "day": 16,
        "blockNumber": 3,
        "title": "CoAP Observe Option (RFC 7641): Asynchronous Sensor Streaming",
        "conceptBudget": {
          "primaryConcept": "CoAP Observe Mechanism",
          "supportingTerms": [
            "Observe Option (`Option Number 6`)",
            "Subscription Handshake (GET request with `Observe: 0` registers client in server observer list)",
            "Asynchronous Notifications (Server pushes state changes whenever sensor updates)",
            "Cancellation via `RST` or `Observe: 1`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d16-b2-con-vs-non-retransmission-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coap_observe_demo.js",
            "initialCode": "function evaluateObserveSubscription(observeHeaderVal) {\n  return (observeHeaderVal === 0)\n    ? 'OBSERVE_REGISTERED: ASYNCHRONOUS_STATE_STREAMING_ACTIVE'\n    : 'OBSERVE_DEREGISTERED: CLIENT_REMOVED_FROM_OBSERVER_LIST';\n}\n\nconsole.log(evaluateObserveSubscription(0));\nconsole.log(evaluateObserveSubscription(1));",
            "expectedOutput": "OBSERVE_REGISTERED: ASYNCHRONOUS_STATE_STREAMING_ACTIVE\nOBSERVE_DEREGISTERED: CLIENT_REMOVED_FROM_OBSERVER_LIST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the CoAP Observe option eliminate the need for clients to continuously poll constrained IoT servers?",
          "options": [
            "The client sends a single GET request with `Observe: 0`, and the server automatically streams asynchronous notification packets back to the client whenever the target sensor value changes",
            "By opening a permanent TCP socket",
            "By broadcasting over FM radio"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "Observe registers a subscription, allowing server-pushed asynchronous updates.",
              "recoveryPath": {
                "simplerExplanation": "Enables server-pushed updates without client polling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "MQTT-SN (MQTT for Sensor Networks) & Gateway Architecture",
    "overviewMetaphor": "MQTT-SN is MQTT on an extreme diet for tiny Zigbee/UDP radios: standard MQTT sends long string topics like `factory/building4/line2/vibration_sensor` in every packet (Wasting 45 bytes on text!); MQTT-SN performs a one-time registration, replacing that 45-byte string with a 2-byte integer Topic ID (e.g. Topic ID `0x0001`); a transparent MQTT-SN Gateway translates between compact UDP radio packets and standard TCP MQTT brokers in the cloud.",
    "blocks": [
      {
        "id": "iotnet-d17-b1-mqttsn-topic-id-registration",
        "day": 17,
        "blockNumber": 1,
        "title": "2-Byte Topic ID Registration & Bandwidth Optimization",
        "conceptBudget": {
          "primaryConcept": "MQTT-SN Topic ID Registration",
          "supportingTerms": [
            "Topic Registration (`REGISTER` / `REGACK` handshake assigns 2-byte `TopicId`)",
            "Pre-defined Topic IDs (Hardcoded IDs in firmware without registration)",
            "Short Topic Names (Fixed 2-character strings)",
            "Eliminating UTF-8 string header bloat over constrained radios"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d16-b1-coap-4byte-binary-header",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard MQTT vs MQTT-SN Header Comparison",
              "boxes": [
                {
                  "label": "1. Standard MQTT (TCP)",
                  "value": "Topic: 'sensors/plant1/valve4/temp' (27 bytes string in EVERY publish!)",
                  "varType": "String Overhead",
                  "isUpdated": false
                },
                {
                  "label": "2. MQTT-SN (UDP / Radio)",
                  "value": "Topic ID: 0x0001 (2 BYTES integer! Saves 25 bytes per packet!)",
                  "varType": "Compact TopicId",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mqttsn_register_demo.js",
            "initialCode": "function calculateTopicSavings(topicStr, publishCount = 1000) {\n  const standardBytes = (topicStr.length + 4) * publishCount;\n  const snBytes = (2 + 4) * publishCount;\n  const savings = standardBytes - snBytes;\n  return {\n    topicString: topicStr,\n    standardMqttTotalBytes: standardBytes,\n    mqttSnTotalBytes: snBytes,\n    bytesSavedOverRadio: savings,\n    reductionPercent: Number(((savings / standardBytes) * 100).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateTopicSavings('sensors/plant1/substation4/transformer_temperature')));",
            "expectedOutput": "{\"topicString\":\"sensors/plant1/substation4/transformer_temperature\",\"standardMqttTotalBytes\":56000,\"mqttSnTotalBytes\":6000,\"bytesSavedOverRadio\":50000,\"reductionPercent\":89.3}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved across 1000 publishes when substituting a 52-character topic with a 2-byte Topic ID?",
          "expectedStringOutput": "89.3",
          "acceptableAnswers": [
            "89.3",
            "89.3%",
            "reductionPercent\":89.3"
          ],
          "primaryMisconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
              "errorExplanation": "Shrinking topic from 52 bytes to 2 bytes saves 89.3% total bandwidth.",
              "recoveryPath": {
                "simplerExplanation": "Saves 89.3% bandwidth.",
                "guidedFixPrompt": "Type 89.3"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d17-b2-mqttsn-transparent-gateway-routing",
        "day": 17,
        "blockNumber": 2,
        "title": "Transparent vs Aggregating MQTT-SN Gateways",
        "conceptBudget": {
          "primaryConcept": "MQTT-SN Gateway Topologies",
          "supportingTerms": [
            "Transparent Gateway (Opens a dedicated 1-to-1 TCP connection to the MQTT broker for each wireless sensor client)",
            "Aggregating Gateway (Multiplexes all sensor streams over 1 single shared TCP connection)",
            "Gateway Discovery (`SEARCHGW`, `GWINFO`, `ADVERTISE`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d17-b1-mqttsn-topic-id-registration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "MQTT-SN Transparent Gateway Bridge Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Sensor sends UDP PUBLISH with TopicId 0x0001 to Gateway",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Gateway looks up TopicId 0x0001 -> Maps to 'sensors/temp'",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Gateway wraps payload into TCP MQTT packet -> Sends to Cloud Broker",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Cloud subscribers receive standard MQTT topic message seamlessly!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_table_demo.js",
            "initialCode": "function translateMqttSn(topicTable, topicId, payload) {\n  const topic = topicTable[topicId];\n  if (!topic) return { success: false, error: 'UNKNOWN_TOPIC_ID' };\n  return {\n    success: true,\n    translatedMqttTopic: topic,\n    payload,\n    status: 'BRIDGED_TO_TCP_MQTT_BROKER'\n  };\n}\n\nconst table = { 1: 'factory/line1/temp', 2: 'factory/line1/pressure' };\nconsole.log(JSON.stringify(translateMqttSn(table, 1, '24.5')));",
            "expectedOutput": "{\"success\":true,\"translatedMqttTopic\":\"factory/line1/temp\",\"payload\":\"24.5\",\"status\":\"BRIDGED_TO_TCP_MQTT_BROKER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What full MQTT string topic is translated from TopicId 1 when mapped to `factory/line1/temp`?",
          "expectedStringOutput": "factory/line1/temp",
          "acceptableAnswers": [
            "factory/line1/temp",
            "translatedMqttTopic\":\"factory/line1/temp\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
              "errorExplanation": "Gateway translates TopicId 1 back into its registered string topic.",
              "recoveryPath": {
                "simplerExplanation": "Translates to factory/line1/temp.",
                "guidedFixPrompt": "Type factory/line1/temp"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d17-b3-mqttsn-sleeping-clients",
        "day": 17,
        "blockNumber": 3,
        "title": "Sleeping Clients: Asynchronous Disconnect & Buffer Queues",
        "conceptBudget": {
          "primaryConcept": "MQTT-SN Sleeping Clients",
          "supportingTerms": [
            "`DISCONNECT` with `Duration` (Informs gateway the client is going to sleep for $T$ seconds)",
            "Gateway Buffer Queue (Buffers incoming subscribed messages during sleep)",
            "Ping / Wakeup (`PINGREQ` flushes buffered messages without re-establishing connection)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d17-b2-mqttsn-transparent-gateway-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sleeping_client_demo.js",
            "initialCode": "function evaluateSleepingClient(isAsleep, gatewayQueue) {\n  if (isAsleep) {\n    return { clientState: 'SLEEPING_DEEP_POW', bufferedCount: gatewayQueue.length, status: 'GATEWAY_BUFFERING_DOWNLINKS' };\n  }\n  return { clientState: 'AWAKE', messagesFlushed: gatewayQueue.splice(0), status: 'QUEUE_DELIVERED' };\n}\n\nconst q = ['CMD_OPEN_VALVE', 'CONFIG_SET_INTERVAL_10S'];\nconsole.log(JSON.stringify(evaluateSleepingClient(true, q)));\nconsole.log(JSON.stringify(evaluateSleepingClient(false, q)));",
            "expectedOutput": "{\"clientState\":\"SLEEPING_DEEP_POW\",\"bufferedCount\":2,\"status\":\"GATEWAY_BUFFERING_DOWNLINKS\"}\n{\"clientState\":\"AWAKE\",\"messagesFlushed\":[\"CMD_OPEN_VALVE\",\"CONFIG_SET_INTERVAL_10S\"],\"status\":\"QUEUE_DELIVERED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does MQTT-SN support battery-powered sleeping sensors that subscribe to downlink commands?",
          "options": [
            "The sensor sends a `DISCONNECT` packet with a sleep duration, instructing the gateway to buffer incoming messages in a queue until the sensor wakes up and sends a `PINGREQ`",
            "By keeping the radio powered 100% of the time",
            "By deleting all downlink messages"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_MQTT_SN_UDP_GATEWAY_CLIENTID_REGISTRATION",
              "errorExplanation": "The gateway buffers messages while the client sleeps and flushes them upon PINGREQ.",
              "recoveryPath": {
                "simplerExplanation": "Gateway buffers messages for sleeping clients.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Compact Binary Serializations: CBOR & MessagePack",
    "overviewMetaphor": "Compact Binary Serialization is Vacuum-Sealing Luggage for LPWAN: sending human-readable JSON `{\"temperature\": 24.5, \"humidity\": 62}` wastes 45 bytes on curly braces, colons, quotes, and ASCII digits; CBOR (Concise Binary Object Representation) packs the same structure into a 12-byte binary bitstream using 3-bit Major Type headers and packed IEEE 754 float bytes, cutting wireless transmit energy and radio airtime by 75%.",
    "blocks": [
      {
        "id": "iotnet-d18-b1-cbor-major-types-header",
        "day": 18,
        "blockNumber": 1,
        "title": "CBOR (RFC 8949) Major Types & Initial Byte Encoding",
        "conceptBudget": {
          "primaryConcept": "CBOR Major Type Encoding",
          "supportingTerms": [
            "3-Bit Major Types: `0` Unsigned Int, `1` Negative Int, `2` Byte String, `3` Text String, `4` Array, `5` Map, `6` Semantic Tag, `7` Float/Simple",
            "5-Bit Additional Information (Direct value 0..23 or byte width indicator 24..27: 1B, 2B, 4B, 8B)",
            "Self-describing binary serialization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d16-b1-coap-4byte-binary-header",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CBOR Initial Byte Structure",
              "boxes": [
                {
                  "label": "Bits 7..5 (Major Type)",
                  "value": "3 bits (0..7) -> Defines whether item is integer, string, array, map, or float",
                  "varType": "Major Type",
                  "isUpdated": false
                },
                {
                  "label": "Bits 4..0 (Additional Info)",
                  "value": "5 bits (0..31) -> Stores integer directly if <= 23; else specifies 1B (24), 2B (25), 4B (26), 8B (27)",
                  "varType": "Additional Info",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cbor_encoder_demo.js",
            "initialCode": "function encodeCborSmallUint(val) {\n  if (val <= 23) {\n    return val.toString(16).padStart(2, '0'); // Single byte (Major Type 0 | Value)\n  }\n  return `18${val.toString(16).padStart(2, '0')}`; // 0x18 prefix + 1-byte uint\n}\n\nconsole.log('Integer 10 in CBOR:', encodeCborSmallUint(10));\nconsole.log('Integer 100 in CBOR:', encodeCborSmallUint(100));",
            "expectedOutput": "Integer 10 in CBOR: 0a\nInteger 100 in CBOR: 1864",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What single hexadecimal byte encodes unsigned integer 10 in CBOR (Major Type 0 with value 10)?",
          "expectedStringOutput": "0a",
          "acceptableAnswers": [
            "0a",
            "0x0a",
            "0A"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
              "errorExplanation": "10 in decimal is hex 0x0a.",
              "recoveryPath": {
                "simplerExplanation": "Hexadecimal 10 is 0a.",
                "guidedFixPrompt": "Type 0a"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d18-b2-cbor-vs-messagepack-comparison",
        "day": 18,
        "blockNumber": 2,
        "title": "CBOR vs MessagePack vs Protocol Buffers for IoT",
        "conceptBudget": {
          "primaryConcept": "Binary Serialization Comparison",
          "supportingTerms": [
            "CBOR (IETF Standard RFC 8949, built for CoAP integration, native IEEE 754 half-precision float16)",
            "MessagePack (Compact, highly popular in web/Node ecosystems)",
            "Protocol Buffers (Requires fixed schema `.proto` compilation, smallest size but zero schema flexibility)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d18-b1-cbor-major-types-header",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Serialization Formats Comparison",
              "boxes": [
                {
                  "label": "1. JSON (ASCII)",
                  "value": "Size: 100% baseline | Schema: None | Parser RAM: High | CoAP: Heavy",
                  "varType": "ASCII Text",
                  "isUpdated": false
                },
                {
                  "label": "2. CBOR (Binary)",
                  "value": "Size: ~35% of JSON | Schema: Self-describing | Parser RAM: Low | CoAP: Native standard",
                  "varType": "IETF Binary",
                  "isUpdated": true
                },
                {
                  "label": "3. Protobuf (Binary)",
                  "value": "Size: ~25% of JSON | Schema: Strict .proto file required | Parser RAM: Minimal",
                  "varType": "Static Schema",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "serialization_comp_demo.js",
            "initialCode": "function evaluatePayloadSizes() {\n  return {\n    jsonSize: '54 bytes (100%)',\n    cborSize: '18 bytes (33% of JSON)',\n    protobufSize: '14 bytes (26% of JSON)',\n    recommendedStandardForCoAP: 'CBOR_RFC_8949'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePayloadSizes()));",
            "expectedOutput": "{\"jsonSize\":\"54 bytes (100%)\",\"cborSize\":\"18 bytes (33% of JSON)\",\"protobufSize\":\"14 bytes (26% of JSON)\",\"recommendedStandardForCoAP\":\"CBOR_RFC_8949\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is CBOR chosen as the default serialization standard for CoAP IoT architectures (IETF RFC 8949)?",
          "options": [
            "Because CBOR is an open IETF standard specifically engineered for constrained nodes, providing compact binary representations with native float16 half-precision support and seamless 1-to-1 data model mapping with JSON",
            "Because CBOR only supports integers",
            "To encrypt sensor data with passwords"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
              "errorExplanation": "CBOR is the IETF standard companion to CoAP for compact binary structures.",
              "recoveryPath": {
                "simplerExplanation": "IETF standard companion to CoAP.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d18-b3-half-precision-float16-savings",
        "day": 18,
        "blockNumber": 3,
        "title": "IEEE 754 Half-Precision Float16 (2 Bytes) Sensor Encoding",
        "conceptBudget": {
          "primaryConcept": "Half-Precision Float16 Encoding",
          "supportingTerms": [
            "Float16 (1 Sign bit + 5 Exponent bits + 10 Mantissa bits = 2 bytes total)",
            "Sensor Range: $\\pm 65,504$ with 0.1% precision (Perfect for temperature $-40^{\\circ}\\text{C}$ to $+85^{\\circ}\\text{C}$)",
            "50% savings over 4-byte Float32"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d18-b2-cbor-vs-messagepack-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "float16_savings_demo.js",
            "initialCode": "function evaluateFloatEncoding(sensorVal) {\n  return {\n    sensorValue: sensorVal,\n    float32Bytes: 4,\n    float16Bytes: 2,\n    bandwidthSavedPerTelemetry: '50%_RADIO_ENERGY_SAVED',\n    status: 'FLOAT16_ENCODING_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFloatEncoding(24.55)));",
            "expectedOutput": "{\"sensorValue\":24.55,\"float32Bytes\":4,\"float16Bytes\":2,\"bandwidthSavedPerTelemetry\":\"50%_RADIO_ENERGY_SAVED\",\"status\":\"FLOAT16_ENCODING_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total bytes are used to encode a temperature reading using IEEE 754 Half-Precision Float16?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 bytes",
            "float16Bytes\":2"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_IOTNET_CBOR_MESSAGEPACK_BINARY_SERIALIZATION",
              "errorExplanation": "4 bytes is Float32. Half-precision Float16 uses exactly 2 bytes.",
              "recoveryPath": {
                "simplerExplanation": "Float16 = 2 bytes.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "DTLS (Datagram Transport Layer Security) for Constrained Nodes",
    "overviewMetaphor": "DTLS is TLS armored for unreliable carrier pigeons: standard TLS assumes a reliable TCP connection where packets never disappear; but over UDP and lossy radio links, packets get dropped and reordered; DTLS (Datagram TLS) adds packet sequence numbers, retransmission timers, and sliding-window replay detection so that constrained sensors can establish encrypted sessions without crashing when packets drop.",
    "blocks": [
      {
        "id": "iotnet-d19-b1-dtls-record-layer-framing",
        "day": 19,
        "blockNumber": 1,
        "title": "DTLS 1.2 / 1.3 Record Layer Framing & Epoch Tracking",
        "conceptBudget": {
          "primaryConcept": "DTLS Record Layer Architecture",
          "supportingTerms": [
            "DTLS Record Header (Content Type, Version, Epoch 16-bit, Sequence Number 48-bit, Length)",
            "Epoch (Increments with each cryptographic re-keying or handshake completion)",
            "Sequence Number (Explicitly included in every datagram since UDP does not preserve order)",
            "13-Byte Header Overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d16-b1-coap-4byte-binary-header",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DTLS Record Header Structure (13 Bytes)",
              "boxes": [
                {
                  "label": "Byte 0 (Type)",
                  "value": "Content Type: 20 (ChangeCipherSpec), 21 (Alert), 22 (Handshake), 23 (AppData)",
                  "varType": "Record Type",
                  "isUpdated": false
                },
                {
                  "label": "Bytes 1..2 (Version)",
                  "value": "DTLS Version (0xFEFD for DTLS 1.2)",
                  "varType": "Version Hex",
                  "isUpdated": false
                },
                {
                  "label": "Bytes 3..4 (Epoch)",
                  "value": "16-bit Epoch counter (Tracks active cipher state)",
                  "varType": "Epoch Counter",
                  "isUpdated": true
                },
                {
                  "label": "Bytes 5..10 (SeqNum)",
                  "value": "48-bit Monotonic Sequence Number (Detects dropped/replayed datagrams)",
                  "varType": "Sequence Num",
                  "isUpdated": false
                },
                {
                  "label": "Bytes 11..12 (Length)",
                  "value": "16-bit Fragment Length in bytes",
                  "varType": "Fragment Len",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dtls_record_demo.js",
            "initialCode": "function buildDtlsRecordHeader(contentType = 23, epoch = 1, seqNum = 100, payloadLen = 20) {\n  return {\n    contentType,\n    dtlsVersion: '0xFEFD (DTLS 1.2)',\n    epoch,\n    sequenceNumber: seqNum,\n    length: payloadLen,\n    headerOverheadBytes: 13\n  };\n}\n\nconsole.log(JSON.stringify(buildDtlsRecordHeader(23, 1, 100, 20)));",
            "expectedOutput": "{\"contentType\":23,\"dtlsVersion\":\"0xFEFD (DTLS 1.2)\",\"epoch\":1,\"sequenceNumber\":100,\"length\":20,\"headerOverheadBytes\":13}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total bytes of header overhead does the DTLS Record Layer add to each datagram frame?",
          "expectedStringOutput": "13",
          "acceptableAnswers": [
            "13",
            "13 bytes",
            "headerOverheadBytes\":13"
          ],
          "primaryMisconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
              "errorExplanation": "Standard TLS is 5 bytes. DTLS includes epoch and 48-bit seqNum = 13 bytes.",
              "recoveryPath": {
                "simplerExplanation": "DTLS record header is 13 bytes.",
                "guidedFixPrompt": "Type 13"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d19-b2-dtls-psk-vs-rpk-certificates",
        "day": 19,
        "blockNumber": 2,
        "title": "DTLS-PSK (Pre-Shared Key) vs Raw Public Keys (RPK)",
        "conceptBudget": {
          "primaryConcept": "DTLS Authentication Modes",
          "supportingTerms": [
            "TLS_PSK (`TLS_PSK_WITH_AES_128_CCM_8`: Symmetric secret key, ~300 byte handshake, minimal RAM)",
            "Raw Public Keys (RPK: RFC 7250, asymmetric keys without bulky X.509 certificate chains)",
            "X.509 Certificates (Bulky 3 KB certificates causing multi-packet fragmentation over radio)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d19-b1-dtls-record-layer-framing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DTLS Cipher Suite Handshake Overhead",
              "boxes": [
                {
                  "label": "1. DTLS-PSK",
                  "value": "Handshake Size: ~350 bytes | RAM: 2 KB | Crypto: Symmetric AES-128 | Fit for 8-bit/32-bit MCUs",
                  "varType": "Ultra Lightweight",
                  "isUpdated": true
                },
                {
                  "label": "2. DTLS-RPK",
                  "value": "Handshake Size: ~800 bytes | RAM: 6 KB | Crypto: ECDSA / ECC P-256 | No cert chain bloat",
                  "varType": "Asymmetric Modern",
                  "isUpdated": false
                },
                {
                  "label": "3. Full X.509 Certs",
                  "value": "Handshake Size: ~4,500 bytes (Heavy fragmentation!) | RAM: 16+ KB | Expensive verification",
                  "varType": "Heavyweight",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dtls_ciphers_demo.js",
            "initialCode": "function selectDtlsCipherSuite(ramAvailableKb) {\n  if (ramAvailableKb < 8) {\n    return 'TLS_PSK_WITH_AES_128_CCM_8: MINIMAL_RAM_SYMMETRIC_PSK';\n  }\n  return 'TLS_ECDHE_ECDSA_WITH_AES_128_CCM_8: ASYMMETRIC_RPK';\n}\n\nconsole.log(selectDtlsCipherSuite(4));\nconsole.log(selectDtlsCipherSuite(16));",
            "expectedOutput": "TLS_PSK_WITH_AES_128_CCM_8: MINIMAL_RAM_SYMMETRIC_PSK\nTLS_ECDHE_ECDSA_WITH_AES_128_CCM_8: ASYMMETRIC_RPK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is DTLS-PSK (`Pre-Shared Key`) widely favored over full X.509 PKI certificates on memory-constrained microcontrollers?",
          "options": [
            "Because DTLS-PSK requires only ~350 bytes for its entire handshake and operates with under 2 KB RAM using symmetric AES keys, avoiding heavy multi-kilobyte X.509 certificate validation chains",
            "Because X.509 certificates are illegal over radio",
            "To disable encryption"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
              "errorExplanation": "PSK minimizes handshake size and RAM consumption on microcontrollers.",
              "recoveryPath": {
                "simplerExplanation": "Minimal handshake size and RAM footprint.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d19-b3-sliding-window-replay-protection",
        "day": 19,
        "blockNumber": 3,
        "title": "Sliding-Window Replay Detection & Connection ID (CID)",
        "conceptBudget": {
          "primaryConcept": "DTLS Replay Protection & Connection ID",
          "supportingTerms": [
            "64-Bit Sliding Window (Accepts out-of-order packets within 64-step window, drops historical duplicates)",
            "DTLS 1.3 Connection ID (CID: RFC 9146 keeps session alive across NAT rebinding and IP changes)",
            "Eliminating session re-handshakes on cellular/Wi-Fi handover"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d19-b2-dtls-psk-vs-rpk-certificates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dtls_replay_demo.js",
            "initialCode": "function evaluateDtlsReplay(maxSeq, incomingSeq, windowSize = 64) {\n  if (incomingSeq > maxSeq) {\n    return { accepted: true, newMaxSeq: incomingSeq, status: 'WINDOW_SLID_FORWARD' };\n  }\n  const delta = maxSeq - incomingSeq;\n  if (delta >= windowSize) {\n    return { accepted: false, status: 'REJECTED_OUTSIDE_SLIDING_WINDOW' };\n  }\n  return { accepted: true, newMaxSeq: maxSeq, status: 'ACCEPTED_OUT_OF_ORDER_WITHIN_WINDOW' };\n}\n\nconsole.log(JSON.stringify(evaluateDtlsReplay(100, 105))); // Newer -> slides\nconsole.log(JSON.stringify(evaluateDtlsReplay(100, 95)));  // Out-of-order within 64\nconsole.log(JSON.stringify(evaluateDtlsReplay(100, 20)));  // Delta 80 > 64 -> Replay attack!",
            "expectedOutput": "{\"accepted\":true,\"newMaxSeq\":105,\"status\":\"WINDOW_SLID_FORWARD\"}\n{\"accepted\":true,\"newMaxSeq\":100,\"status\":\"ACCEPTED_OUT_OF_ORDER_WITHIN_WINDOW\"}\n{\"accepted\":false,\"status\":\"REJECTED_OUTSIDE_SLIDING_WINDOW\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by DTLS replay protection when a packet arrives with sequence number 20 while the current maximum sequence number is 100 (delta 80 > window size 64)?",
          "expectedStringOutput": "REJECTED_OUTSIDE_SLIDING_WINDOW",
          "acceptableAnswers": [
            "REJECTED_OUTSIDE_SLIDING_WINDOW",
            "status\":\"REJECTED_OUTSIDE_SLIDING_WINDOW\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
          "diagnosisMap": {
            "ACCEPTED": {
              "misconceptionId": "MC_IOTNET_DTLS_PSK_CERTIFICATES_HANDSHAKE_OVERHEAD",
              "errorExplanation": "Delta 80 exceeds the 64-step window, triggering REJECTED_OUTSIDE_SLIDING_WINDOW.",
              "recoveryPath": {
                "simplerExplanation": "Outside 64-step window -> REJECTED_OUTSIDE_SLIDING_WINDOW.",
                "guidedFixPrompt": "Type REJECTED_OUTSIDE_SLIDING_WINDOW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "6LoWPAN: IPv6 Header Compression (LOWPAN_IPHC)",
    "overviewMetaphor": "6LoWPAN is folding an oversized king-size bedsheet into a tiny pocket handkerchief: standard IPv6 headers are 40 bytes long, and UDP headers are 8 bytes (48 bytes total); IEEE 802.15.4 radio packets can only hold 127 bytes total; 6LoWPAN LOWPAN_IPHC compression recognizes that the source and destination IPv6 addresses share the same mesh prefix and link-local MAC addresses, compressing that 48-byte header down to just 6 bytes (An 87.5% reduction!), leaving 100+ bytes free for actual sensor data.",
    "blocks": [
      {
        "id": "iotnet-d20-b1-6lowpan-adaptation-layer",
        "day": 20,
        "blockNumber": 1,
        "title": "The 6LoWPAN Adaptation Layer (RFC 4944 / RFC 6282)",
        "conceptBudget": {
          "primaryConcept": "6LoWPAN Adaptation Layer",
          "supportingTerms": [
            "Adaptation Layer between IEEE 802.15.4 Link Layer and IPv6 Network Layer",
            "MTU Invariant: IPv6 requires minimum 1280 bytes MTU; 802.15.4 frame is max 127 bytes",
            "6LoWPAN Fragmentation (`FRAG1` and `FRAGN` headers)",
            "Header Compression (`LOWPAN_IPHC`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d7-b1-ieee-802154-phy-mac-foundations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "6LoWPAN Protocol Stack Layering",
              "boxes": [
                {
                  "label": "Application Layer",
                  "value": "CoAP / CBOR / DTLS (RESTful Sensor Application)",
                  "varType": "App Layer",
                  "isUpdated": false
                },
                {
                  "label": "Network Layer",
                  "value": "IPv6 + RPL Mesh Routing (Standard 1280-byte IPv6 MTU)",
                  "varType": "Network Layer",
                  "isUpdated": false
                },
                {
                  "label": "6LoWPAN Adaptation",
                  "value": "LOWPAN_IPHC Header Compression + Packet Fragmentation / Reassembly",
                  "varType": "6LoWPAN Shim",
                  "isUpdated": true
                },
                {
                  "label": "Data Link & PHY",
                  "value": "IEEE 802.15.4 (2.4 GHz, 250 kbps, 127-byte Physical MTU)",
                  "varType": "802.15.4 Radio",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "adaptation_demo.js",
            "initialCode": "function evaluate6lowpanNeed(ipv6PacketBytes, max802154Frame = 127) {\n  return (ipv6PacketBytes > max802154Frame)\n    ? '6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED'\n    : 'DIRECT_FRAME_TRANSMISSION';\n}\n\nconsole.log(evaluate6lowpanNeed(1280));\nconsole.log(evaluate6lowpanNeed(50));",
            "expectedOutput": "6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED\nDIRECT_FRAME_TRANSMISSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mechanism is engaged by 6LoWPAN when bridging a standard 1280-byte IPv6 packet over a 127-byte 802.15.4 frame?",
          "expectedStringOutput": "6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED",
          "acceptableAnswers": [
            "6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED",
            "6LOWPAN_FRAGMENTATION"
          ],
          "primaryMisconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
          "diagnosisMap": {
            "DIRECT": {
              "misconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
              "errorExplanation": "1280 bytes exceeds 127 bytes, engaging 6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED.",
              "recoveryPath": {
                "simplerExplanation": "Engages fragmentation and compression.",
                "guidedFixPrompt": "Type 6LOWPAN_FRAGMENTATION_AND_HEADER_COMPRESSION_ENGAGED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d20-b2-lowpan-iphc-compression-bitfields",
        "day": 20,
        "blockNumber": 2,
        "title": "LOWPAN_IPHC Encoding: Eliding Known IPv6 Prefixes & MAC Addresses",
        "conceptBudget": {
          "primaryConcept": "LOWPAN_IPHC Compression Bitfields",
          "supportingTerms": [
            "Dispatch Byte (`0x60` identifies LOWPAN_IPHC)",
            "SAM / DAM (Source / Destination Address Mode: Stateless compression deriving lower 64 bits from 802.15.4 MAC address)",
            "TF (Traffic Class and Flow Label elided)",
            "NH (Next Header: Compressed UDP to 4 bits!)",
            "Compressing 48 bytes (IPv6+UDP) to 6 bytes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d20-b1-6lowpan-adaptation-layer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Uncompressed vs LOWPAN_IPHC Header Sizes",
              "boxes": [
                {
                  "label": "1. Uncompressed IPv6 + UDP",
                  "value": "IPv6 Header: 40 bytes | UDP Header: 8 bytes | Total: 48 BYTES OVERHEAD",
                  "varType": "Uncompressed",
                  "isUpdated": false
                },
                {
                  "label": "2. 6LoWPAN LOWPAN_IPHC",
                  "value": "IPHC Header: 2 bytes | Compressed UDP: 4 bytes | Total: 6 BYTES! (87.5% Savings!)",
                  "varType": "Compressed IPHC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iphc_calc_demo.js",
            "initialCode": "function calculateHeaderSavings(uncompressedBytes = 48, iphcBytes = 6) {\n  const savingsPercent = ((uncompressedBytes - iphcBytes) / uncompressedBytes) * 100;\n  return {\n    uncompressedBytes,\n    compressedIphcBytes: iphcBytes,\n    bandwidthReductionPercent: Number(savingsPercent.toFixed(1)),\n    status: 'LOWPAN_IPHC_HEADER_COMPRESSED_SUCCESS'\n  };\n}\n\nconsole.log(JSON.stringify(calculateHeaderSavings()));",
            "expectedOutput": "{\"uncompressedBytes\":48,\"compressedIphcBytes\":6,\"bandwidthReductionPercent\":87.5,\"status\":\"LOWPAN_IPHC_HEADER_COMPRESSED_SUCCESS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved by LOWPAN_IPHC compressing a 48-byte IPv6/UDP header down to 6 bytes?",
          "expectedStringOutput": "87.5",
          "acceptableAnswers": [
            "87.5",
            "87.5%",
            "bandwidthReductionPercent\":87.5"
          ],
          "primaryMisconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
              "errorExplanation": "(48 - 6) / 48 = 87.5% reduction.",
              "recoveryPath": {
                "simplerExplanation": "48 down to 6 = 87.5% reduction.",
                "guidedFixPrompt": "Type 87.5"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d20-b3-mesh-under-vs-route-over",
        "day": 20,
        "blockNumber": 3,
        "title": "Mesh-Under vs Route-Over Multihop Forwarding",
        "conceptBudget": {
          "primaryConcept": "Mesh-Under vs Route-Over",
          "supportingTerms": [
            "Mesh-Under (Layer 2 MAC routing using 6LoWPAN mesh headers; network looks like 1 single IP subnet)",
            "Route-Over (Layer 3 IP routing with RPL; every node is an IP router deciding next hop)",
            "Route-Over chosen for Thread and Zigbee IP"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d20-b2-lowpan-iphc-compression-bitfields",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "route_over_demo.js",
            "initialCode": "function evaluateMeshForwardingLayer(mode) {\n  return (mode === 'ROUTE_OVER')\n    ? 'ROUTE_OVER: LAYER_3_IPV6_RPL_ROUTING_AT_EVERY_HOP'\n    : 'MESH_UNDER: LAYER_2_MAC_FRAME_FORWARDING';\n}\n\nconsole.log(evaluateMeshForwardingLayer('ROUTE_OVER'));\nconsole.log(evaluateMeshForwardingLayer('MESH_UNDER'));",
            "expectedOutput": "ROUTE_OVER: LAYER_3_IPV6_RPL_ROUTING_AT_EVERY_HOP\nMESH_UNDER: LAYER_2_MAC_FRAME_FORWARDING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which forwarding architecture is used by Thread and modern 6LoWPAN networks where every intermediate node executes Layer 3 IPv6 routing decisions using RPL?",
          "options": [
            "Route-Over (Layer 3 IPv6 routing allows standard end-to-end IP security and routing protocols across heterogeneous links)",
            "Mesh-Under",
            "Direct-Cellular"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_6LOWPAN_IPV6_HEADER_COMPRESSION_LOWPAN_IPHC",
              "errorExplanation": "Route-Over routes at Layer 3 using IPv6 and RPL.",
              "recoveryPath": {
                "simplerExplanation": "Route-Over routes at Layer 3 IPv6.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production Constrained Protocol & Security Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete industrial constrained IoT stack: 1. CoAP 4-byte binary header generation; 2. MQTT-SN 2-byte Topic ID allocation; 3. CBOR compact binary serialization with Float16 packing; 4. DTLS-PSK authenticated session encryption with 64-step sliding window replay protection; 5. 6LoWPAN LOWPAN_IPHC header compression (48B $\\to$ 6B) fitting seamlessly into single 802.15.4 frames.",
    "blocks": [
      {
        "id": "iotnet-d21-b1-constrained-protocol-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Constrained Protocol & Security Stack Synthesis",
        "conceptBudget": {
          "primaryConcept": "Constrained Stack Synthesis",
          "supportingTerms": [
            "CoAP REST Engine",
            "CBOR Serializer",
            "DTLS PSK Security Layer",
            "6LoWPAN Compression Pipeline"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d20-b2-lowpan-iphc-compression-bitfields",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Constrained Packet Processing Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Application encodes telemetry struct into CBOR binary format (12 bytes)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "CoAP layer attaches 4-byte binary header with Message ID & Token",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "DTLS layer encrypts payload with AES-128-CCM & attaches 13B record header",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "6LoWPAN compresses IPv6 headers to 6B -> Transmits single 802.15.4 frame!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "constrained_stack_demo.js",
            "initialCode": "function runConstrainedStack() {\n  return {\n    cborSerializerStatus: 'CBOR_FLOAT16_ENCODED',\n    coapHeaderStatus: 'COAP_4BYTE_HEADER_PACKED',\n    dtlsSecurityStatus: 'DTLS_PSK_AES_CCM_ENCRYPTED',\n    lowpanCompressionStatus: 'LOWPAN_IPHC_6BYTE_COMPRESSED',\n    stackStatus: 'CONSTRAINED_STACK_NOMINAL'\n  };\n}\n\nconsole.log(runConstrainedStack().stackStatus);",
            "expectedOutput": "CONSTRAINED_STACK_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What stack status confirms operational synthesis of the Constrained Protocol & Security Engine?",
          "expectedStringOutput": "CONSTRAINED_STACK_NOMINAL",
          "acceptableAnswers": [
            "CONSTRAINED_STACK_NOMINAL",
            "stackStatus: CONSTRAINED_STACK_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "Matches CONSTRAINED_STACK_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONSTRAINED_STACK_NOMINAL.",
                "guidedFixPrompt": "Type CONSTRAINED_STACK_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d21-b2-constrained-security-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Constrained Protocol Security & Packet Size Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Constrained Stack Invariant Audit",
          "supportingTerms": [
            "802.15.4 Frame Budget Invariant ($< 127\\text{ bytes}$)",
            "DTLS Anti-Replay Verification",
            "Zero Fragmentation Guarantee"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d21-b1-constrained-protocol-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "constrained_audit_demo.js",
            "initialCode": "function auditConstrainedFrame(totalWireBytes, isEncrypted, isReplayProtected) {\n  const fitsInSingleFrame = totalWireBytes <= 127;\n  const isSecure = isEncrypted && isReplayProtected;\n  const passed = fitsInSingleFrame && isSecure;\n  return {\n    totalWireBytes,\n    fitsInSingleFrame,\n    isSecure,\n    grade: passed ? 'CONSTRAINED_STACK_AUDIT_PASSED' : 'STACK_INVARIANT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditConstrainedFrame(35, true, true)));",
            "expectedOutput": "{\"totalWireBytes\":35,\"fitsInSingleFrame\":true,\"isSecure\":true,\"grade\":\"CONSTRAINED_STACK_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when a 35-byte encrypted packet passes single-frame constraints and anti-replay verification?",
          "expectedStringOutput": "CONSTRAINED_STACK_AUDIT_PASSED",
          "acceptableAnswers": [
            "CONSTRAINED_STACK_AUDIT_PASSED",
            "grade\":\"CONSTRAINED_STACK_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "All checks passed awards CONSTRAINED_STACK_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CONSTRAINED_STACK_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CONSTRAINED_STACK_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d21-b3-milestone3-iotnet-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Production Constrained Protocol Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Constrained Protocol Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d21-b2-constrained-security-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_iotnet_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Production Constrained Protocol & Security Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Production Constrained Protocol & Security Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Production Constrained Protocol & Security Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Production Constrained Protocol & Security Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_COAP_UDP_RESTFUL_CONFIRMABLE_CON_NON",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Production Constrained Protocol & Security Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "RPL (Routing Protocol for Low-Power and Lossy Networks)",
    "overviewMetaphor": "RPL is rainwater flowing down a hillside: the Root Gateway sits at the bottom of the valley (DODAG Root with Rank 0); every uphill node calculates its elevation (Rank: distance from the root); rainwater (Uplink telemetry) naturally flows downhill from high rank to low rank; the Trickle Timer acts like a water meter that stays quiet when the stream is calm (Slow periodic updates), but alarms instantly when a landslide breaks a dam (Network topology change), triggering fast re-routing.",
    "blocks": [
      {
        "id": "iotnet-d22-b1-dodag-construction-and-ranks",
        "day": 22,
        "blockNumber": 1,
        "title": "DODAG Topologies, Ranks & Loop-Free Invariants",
        "conceptBudget": {
          "primaryConcept": "RPL DODAG Rank Invariant",
          "supportingTerms": [
            "Destination-Oriented Directed Acyclic Graph (DODAG)",
            "DODAG Root (Gateway node with Rank `MinHopRankIncrease` = 256)",
            "Strict Rank Monotonicity ($Rank(\\text{Child}) > Rank(\\text{Parent})$)",
            "Loop-free guarantee in lossy wireless mesh"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d20-b3-mesh-under-vs-route-over",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RPL DODAG Rank Hierarchy",
              "boxes": [
                {
                  "label": "1. DODAG Root (Gateway)",
                  "value": "Rank: 256 (Base Rank) -> Sits at root of DAG tree",
                  "varType": "DODAG Root",
                  "isUpdated": false
                },
                {
                  "label": "2. Hop 1 Router",
                  "value": "Rank: 512 (Parent Rank 256 + MinHopRankIncrease 256) -> Forwards uplinks to root",
                  "varType": "Hop 1 Router",
                  "isUpdated": false
                },
                {
                  "label": "3. Hop 2 Leaf Node",
                  "value": "Rank: 768 (Parent Rank 512 + MinHopRankIncrease 256) -> Sensor node",
                  "varType": "Hop 2 Leaf",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dodag_rank_demo.js",
            "initialCode": "function calculateChildRank(parentRank, minHopRankIncrease = 256) {\n  const childRank = parentRank + minHopRankIncrease;\n  return {\n    parentRank,\n    childRank,\n    isLoopFree: childRank > parentRank,\n    status: 'RPL_RANK_VALID_LOOP_FREE'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChildRank(256)));\nconsole.log(JSON.stringify(calculateChildRank(512)));",
            "expectedOutput": "{\"parentRank\":256,\"childRank\":512,\"isLoopFree\":true,\"status\":\"RPL_RANK_VALID_LOOP_FREE\"}\n{\"parentRank\":512,\"childRank\":768,\"isLoopFree\":true,\"status\":\"RPL_RANK_VALID_LOOP_FREE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated node rank for a child node selecting a parent with rank 512 when `minHopRankIncrease` is 256?",
          "expectedStringOutput": "768",
          "acceptableAnswers": [
            "768",
            "childRank\":768"
          ],
          "primaryMisconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
          "diagnosisMap": {
            "512": {
              "misconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
              "errorExplanation": "512 + 256 = 768.",
              "recoveryPath": {
                "simplerExplanation": "Parent rank + 256 = 768.",
                "guidedFixPrompt": "Type 768"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d22-b2-trickle-timer-algorithm",
        "day": 22,
        "blockNumber": 2,
        "title": "The Trickle Timer Algorithm (RFC 6206): Quiet Network Suppression",
        "conceptBudget": {
          "primaryConcept": "Trickle Timer Algorithm",
          "supportingTerms": [
            "$I_{\\text{min}}$ (Minimum interval, e.g. 10 ms for fast convergence)",
            "$I_{\\text{max}}$ (Maximum interval, e.g. 16 minutes for zero control overhead in quiet steady state)",
            "Redundancy Constant $k$ (If $c \\ge k$ consistent DIO messages heard, suppress transmission!)",
            "Reset to $I_{\\text{min}}$ on inconsistency detection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d22-b1-dodag-construction-and-ranks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Trickle Timer State Machine",
              "nodes": [
                {
                  "id": "1",
                  "label": "Interval starts at I_min (10 ms) -> Broadcasts DIO routing updates",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Network is stable (c >= k consistent messages heard) -> Suppress broadcast!",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Double interval I = min(I * 2, I_max) -> Drops control traffic by 99%!",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Link breaks or inconsistency detected? -> Reset I = I_min instantly!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "trickle_sim.js",
            "initialCode": "function simulateTrickleProgression(minSec = 1, maxDoublings = 10) {\n  let currentInterval = minSec;\n  const intervals = [currentInterval];\n  for (let i = 0; i < maxDoublings; i++) {\n    currentInterval *= 2;\n    intervals.push(currentInterval);\n  }\n  return {\n    startIntervalSec: minSec,\n    maxIntervalSec: intervals[intervals.length - 1],\n    maxIntervalMinutes: Number((intervals[intervals.length - 1] / 60).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(simulateTrickleProgression(1, 10))); // 1s doubled 10 times = 1024s (~17 min)",
            "expectedOutput": "{\"startIntervalSec\":1,\"maxIntervalSec\":1024,\"maxIntervalMinutes\":17.1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Trickle Timer algorithm prevent wireless mesh networks from wasting energy on constant routing overhead?",
          "options": [
            "When the network is stable and consistent, Trickle exponentially doubles the interval between routing updates up to hours, transmitting updates only when a broken link or topology inconsistency resets the timer to `I_min`",
            "By disabling all routers permanently",
            "By using satellite links"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
              "errorExplanation": "Trickle exponentially scales back routing broadcasts during quiet network periods.",
              "recoveryPath": {
                "simplerExplanation": "Doubles update intervals to minimize control traffic.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d22-b3-objective-functions-of0-vs-mrhof",
        "day": 22,
        "blockNumber": 3,
        "title": "RPL Objective Functions: OF0 (Hop Count) vs MRHOF (ETX Link Quality)",
        "conceptBudget": {
          "primaryConcept": "RPL Objective Functions",
          "supportingTerms": [
            "Objective Function 0 (OF0: Simple hop-count distance)",
            "Minimum Rank with Hysteresis Objective Function (MRHOF: Uses Expected Transmission Count ETX)",
            "ETX metric ($1 / (D_f \\times D_r)$ evaluates actual packet loss probabilities)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d22-b2-trickle-timer-algorithm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mrhof_etx_demo.js",
            "initialCode": "function selectBestParentEtx(candidates) {\n  // candidates = [{ parent: 'A', etx: 1.1 }, { parent: 'B', etx: 3.5 }]\n  candidates.sort((a, b) => a.etx - b.etx); // Lowest ETX has fewest retransmissions!\n  const best = candidates[0];\n  return {\n    bestParent: best.parent,\n    lowestEtx: best.etx,\n    objectiveFunction: 'MRHOF_ETX_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(selectBestParentEtx([{ parent: 'Node_A', etx: 3.2 }, { parent: 'Node_B', etx: 1.15 }])));",
            "expectedOutput": "{\"bestParent\":\"Node_B\",\"lowestEtx\":1.15,\"objectiveFunction\":\"MRHOF_ETX_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which candidate parent is selected by MRHOF when Node A has ETX 3.2 and Node B has ETX 1.15?",
          "expectedStringOutput": "Node_B",
          "acceptableAnswers": [
            "Node_B",
            "bestParent\":\"Node_B\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
          "diagnosisMap": {
            "Node_A": {
              "misconceptionId": "MC_IOTNET_RPL_ROUTING_DODAG_OBJECTIVE_FUNCTIONS",
              "errorExplanation": "MRHOF minimizes expected retransmissions; Node B (ETX 1.15) is superior.",
              "recoveryPath": {
                "simplerExplanation": "Lowest ETX is best -> Node_B.",
                "guidedFixPrompt": "Type Node_B"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "RF Antennas, Impedance Matching & VSWR",
    "overviewMetaphor": "RF Antenna Impedance Matching is like a speaker connected to an amplifier through a garden hose: if the impedance matches perfectly at 50 Ohms (VSWR = 1.0), 100% of the electrical energy converts into outgoing radio waves flying through the sky; if the antenna is poorly matched ($S_{11} > -3\\text{ dB}$), the radio wave hits a brick wall at the antenna joint and bounces straight back into the transmitter as heat, destroying your battery range and potentially frying the RF power amplifier.",
    "blocks": [
      {
        "id": "iotnet-d23-b1-vswr-and-return-loss-s11",
        "day": 23,
        "blockNumber": 1,
        "title": "Voltage Standing Wave Ratio (VSWR), Reflection Coefficient & $S_{11}$",
        "conceptBudget": {
          "primaryConcept": "VSWR and Return Loss ($S_{11}$)",
          "supportingTerms": [
            "Return Loss ($S_{11}\\text{ in dB} = -20\\log_{10}|\\Gamma|$)",
            "Reflection Coefficient ($\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}$)",
            "VSWR ($\\text{VSWR} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|}$)",
            "Industry Benchmark: $S_{11} \\le -10\\text{ dB}$ (VSWR $< 1.92\\implies > 90\\%$ radiated energy)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Antenna Matching Benchmark Thresholds",
              "boxes": [
                {
                  "label": "1. Excellent Match (S11 <= -15 dB)",
                  "value": "VSWR: < 1.43 | Reflected Power: < 3% | Radiated Power: > 97% (Maximum Range)",
                  "varType": "Ideal Match",
                  "isUpdated": false
                },
                {
                  "label": "2. Acceptable Commercial (S11 <= -10 dB)",
                  "value": "VSWR: < 1.92 | Reflected Power: < 10% | Radiated Power: > 90%",
                  "varType": "Standard Match",
                  "isUpdated": true
                },
                {
                  "label": "3. Poor Match (S11 >= -3 dB)",
                  "value": "VSWR: > 5.8 | Reflected Power: > 50% | Radiated Power: < 50% (Range destroyed!)",
                  "varType": "Defect Mismatch",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vswr_math_demo.js",
            "initialCode": "function evaluateAntennaMatch(s11Db) {\n  const gamma = Math.pow(10, -Math.abs(s11Db) / 20);\n  const vswr = (1 + gamma) / (1 - gamma);\n  const radiatedPercent = (1 - (gamma * gamma)) * 100;\n  return {\n    s11Db,\n    reflectionCoeff: Number(gamma.toFixed(3)),\n    vswr: Number(vswr.toFixed(2)),\n    radiatedPowerPercent: Number(radiatedPercent.toFixed(1)),\n    status: s11Db <= -10 ? 'ANTENNA_MATCH_PASS' : 'ANTENNA_HIGH_REFLECTION_FAIL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAntennaMatch(-15)));\nconsole.log(JSON.stringify(evaluateAntennaMatch(-3)));",
            "expectedOutput": "{\"s11Db\":-15,\"reflectionCoeff\":0.178,\"vswr\":1.43,\"radiatedPowerPercent\":96.8,\"status\":\"ANTENNA_MATCH_PASS\"}\n{\"s11Db\":-3,\"reflectionCoeff\":0.708,\"vswr\":5.85,\"radiatedPowerPercent\":49.9,\"status\":\"ANTENNA_HIGH_REFLECTION_FAIL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded to an RF antenna achieving $S_{11} = -15\\text{ dB}$ (VSWR 1.43)?",
          "expectedStringOutput": "ANTENNA_MATCH_PASS",
          "acceptableAnswers": [
            "ANTENNA_MATCH_PASS",
            "status\":\"ANTENNA_MATCH_PASS\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
          "diagnosisMap": {
            "FAIL": {
              "misconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
              "errorExplanation": "-15 dB satisfies the <= -10 dB standard threshold.",
              "recoveryPath": {
                "simplerExplanation": "Matches ANTENNA_MATCH_PASS.",
                "guidedFixPrompt": "Type ANTENNA_MATCH_PASS"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d23-b2-antenna-types-pcb-vs-whip",
        "day": 23,
        "blockNumber": 2,
        "title": "PCB Trace (Inverted-F / Meandered) vs Monopole Whip Antennas",
        "conceptBudget": {
          "primaryConcept": "Antenna Topologies & Ground Planes",
          "supportingTerms": [
            "Quarter-Wave Monopole ($\\lambda / 4$ length, e.g. 8.6 cm at 868 MHz)",
            "PCB Inverted-F Antenna (IFA / MIFA: Compact trace on FR4, zero BOM cost)",
            "Ground Plane Invariant (Antennas require solid copper ground plane for image currents)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d23-b1-vswr-and-return-loss-s11",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quarter_wave_demo.js",
            "initialCode": "function calculateQuarterWaveMm(freqMhz, velocityFactor = 0.95) {\n  const cMmPerSec = 299792458000; // mm/s\n  const lambdaMm = cMmPerSec / (freqMhz * 1000000);\n  const quarterWave = (lambdaMm / 4) * velocityFactor;\n  return {\n    freqMhz,\n    quarterWaveLengthMm: Number(quarterWave.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateQuarterWaveMm(868))); // Sub-GHz\nconsole.log(JSON.stringify(calculateQuarterWaveMm(2400))); // 2.4 GHz",
            "expectedOutput": "{\"freqMhz\":868,\"quarterWaveLengthMm\":82.1}\n{\"freqMhz\":2400,\"quarterWaveLengthMm\":29.7}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the physical quarter-wave antenna length in millimeters for a 2.4 GHz Bluetooth/Wi-Fi radio with 0.95 velocity factor?",
          "expectedStringOutput": "29.7",
          "acceptableAnswers": [
            "29.7",
            "29.7 mm",
            "quarterWaveLengthMm\":29.7"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
          "diagnosisMap": {
            "82.1": {
              "misconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
              "errorExplanation": "82.1 mm is for 868 MHz. 2.4 GHz is ~29.7 mm.",
              "recoveryPath": {
                "simplerExplanation": "2.4 GHz quarter wave = 29.7 mm.",
                "guidedFixPrompt": "Type 29.7"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d23-b3-smith-chart-pi-matching-networks",
        "day": 23,
        "blockNumber": 3,
        "title": "Pi / T Impedance Matching Networks on the Smith Chart",
        "conceptBudget": {
          "primaryConcept": "Pi Matching Networks",
          "supportingTerms": [
            "Smith Chart Normalization ($Z_0 = 50\\,\\Omega$ at the center)",
            "Pi Matching Filter (Shunt Capacitor + Series Inductor + Shunt Capacitor)",
            "Harmonic Suppression (Filtering 2nd and 3rd RF harmonics)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d23-b2-antenna-types-pcb-vs-whip",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pi_match_demo.js",
            "initialCode": "function evaluatePiNetwork(isTunedTo50Ohm) {\n  return isTunedTo50Ohm\n    ? 'PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION'\n    : 'UNMATCHED_REACTIVE_LOAD';\n}\n\nconsole.log(evaluatePiNetwork(true));",
            "expectedOutput": "PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is confirmed when the Pi matching network transforms complex antenna impedance to 50 Ohms at the center of the Smith Chart?",
          "expectedStringOutput": "PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION",
          "acceptableAnswers": [
            "PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION",
            "PI_NETWORK_TUNED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
          "diagnosisMap": {
            "UNMATCHED": {
              "misconceptionId": "MC_IOTNET_ANTENNA_RF_MATCHING_VSWR_PATH_LOSS",
              "errorExplanation": "Matches PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches PI_NETWORK_TUNED.",
                "guidedFixPrompt": "Type PI_NETWORK_TUNED: 50_OHM_CENTER_SMITH_CHART_TRANSFORMATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Cellular AT Commands State Machine & Modem Management",
    "overviewMetaphor": "An Embedded Cellular AT Command Parser is an automated dialogue with a stubborn telecom modem: the microcontroller sends text commands over a UART serial port (`AT+CSQ` checks signal strength, `AT+CGATT=1` attaches to cellular towers, `AT+QIACT=1` activates the PDP context); the state machine must handle unexpected interruptions (Unsolicited Result Codes URC like `+QIURC: closed`), parse responses without blocking the main CPU loop, and implement timeouts for every step.",
    "blocks": [
      {
        "id": "iotnet-d24-b1-at-parser-state-machine",
        "day": 24,
        "blockNumber": 1,
        "title": "Non-Blocking AT Command Parser State Machine",
        "conceptBudget": {
          "primaryConcept": "Non-Blocking AT State Machine",
          "supportingTerms": [
            "States: `IDLE`, `SEND_CMD`, `AWAIT_RESPONSE`, `PARSE_URC`, `TIMEOUT_RECOVERY`",
            "Line Terminator (`\\r\\n`)",
            "Response Tokens: `OK`, `ERROR`, `+CME ERROR`, `CONNECT`",
            "UART Circular Buffer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d13-b1-nbiot-vs-ltem-technical-differences",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Cellular AT Command State Machine",
              "nodes": [
                {
                  "id": "1",
                  "label": "Transmit AT command string over UART with timeout timer",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Receive UART line ending with \\r\\n",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Matches OK? -> Advance to next state! Matches ERROR? -> Retry backoff",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Matches +QIURC? -> Dispatch asynchronous event handler without dropping state",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "at_statemachine_demo.js",
            "initialCode": "function parseAtLine(line, pendingCmd) {\n  if (line.includes('OK')) return { status: 'SUCCESS', nextCmd: 'AT+CGATT=1' };\n  if (line.includes('ERROR')) return { status: 'FAILURE_RETRY_BACKOFF' };\n  if (line.startsWith('+CSQ:')) {\n    const csqVal = parseInt(line.split(':')[1].split(',')[0].trim(), 10);\n    return { status: 'PARSED_METRIC', csq: csqVal, rssiDbm: -113 + 2 * csqVal };\n  }\n  return { status: 'BUFFERING' };\n}\n\nconsole.log(JSON.stringify(parseAtLine('+CSQ: 24,99', 'AT+CSQ')));\nconsole.log(JSON.stringify(parseAtLine('OK', 'AT+CSQ')));",
            "expectedOutput": "{\"status\":\"PARSED_METRIC\",\"csq\":24,\"rssiDbm\":-65}\n{\"status\":\"SUCCESS\",\"nextCmd\":\"AT+CGATT=1\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What calculated RSSI in dBm is derived from a cellular `+CSQ: 24,99` reading ($-113 + 2 \\times 24$)?",
          "expectedStringOutput": "-65",
          "acceptableAnswers": [
            "-65",
            "-65 dBm",
            "-65dBm",
            "rssiDbm\":-65"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
          "diagnosisMap": {
            "-113": {
              "misconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
              "errorExplanation": "-113 + (2 * 24) = -113 + 48 = -65 dBm.",
              "recoveryPath": {
                "simplerExplanation": "-113 + 48 = -65 dBm.",
                "guidedFixPrompt": "Type -65"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d24-b2-urc-unsolicited-result-codes",
        "day": 24,
        "blockNumber": 2,
        "title": "Handling Unsolicited Result Codes (URCs) & Ring Buffers",
        "conceptBudget": {
          "primaryConcept": "URC Asynchronous Dispatch",
          "supportingTerms": [
            "Unsolicited Result Codes (URCs like `+QIURC: \"recv\"`, `+CREG: 1`, `RING`)",
            "Interleaved URC Hazard (URCs arriving while waiting for `OK` on another command)",
            "Dedicated URC Parser Callback Queue"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d24-b1-at-parser-state-machine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "urc_handler_demo.js",
            "initialCode": "function evaluateIncomingUartLine(line, awaitingCmd) {\n  if (line.includes('+QIURC: \"recv\"')) {\n    return 'ASYNCHRONOUS_URC_DISPATCHED_TO_SOCKET_HANDLER';\n  }\n  return `AWAITING_COMMAND_RESPONSE_FOR_${awaitingCmd}`;\n}\n\nconsole.log(evaluateIncomingUartLine('+QIURC: \"recv\",0,42', 'AT+CSQ'));",
            "expectedOutput": "ASYNCHRONOUS_URC_DISPATCHED_TO_SOCKET_HANDLER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What handler action is taken when an asynchronous socket receive URC arrives over UART during command execution?",
          "expectedStringOutput": "ASYNCHRONOUS_URC_DISPATCHED_TO_SOCKET_HANDLER",
          "acceptableAnswers": [
            "ASYNCHRONOUS_URC_DISPATCHED_TO_SOCKET_HANDLER",
            "URC_DISPATCHED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
          "diagnosisMap": {
            "DROPPED": {
              "misconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
              "errorExplanation": "URCs must be dispatched to their asynchronous handler without dropping state.",
              "recoveryPath": {
                "simplerExplanation": "Dispatches to socket handler.",
                "guidedFixPrompt": "Type ASYNCHRONOUS_URC_DISPATCHED_TO_SOCKET_HANDLER"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d24-b3-pdp-context-activation-flow",
        "day": 24,
        "blockNumber": 3,
        "title": "PDP Context Activation & IP Socket Lifecycle",
        "conceptBudget": {
          "primaryConcept": "PDP Context & Socket Lifecycle",
          "supportingTerms": [
            "Packet Data Protocol (PDP) Context",
            "`AT+CGDCONT=1,\"IP\",\"hologram\"` (APN configuration)",
            "`AT+CGACT=1,1` (PDP activation assigns dynamic cellular IP address)",
            "TCP/UDP Socket Open (`AT+QIOPEN`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d24-b2-urc-unsolicited-result-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pdp_context_demo.js",
            "initialCode": "function evaluateCellularLifecycle(pdpActive, socketConnected) {\n  if (pdpActive && socketConnected) {\n    return 'CELLULAR_DATA_PIPELINE_ONLINE';\n  }\n  return 'PDP_DEACTIVATED_RECONNECT_REQUIRED';\n}\n\nconsole.log(evaluateCellularLifecycle(true, true));",
            "expectedOutput": "CELLULAR_DATA_PIPELINE_ONLINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pipeline status confirms active PDP context and open TCP/UDP socket on the cellular modem?",
          "expectedStringOutput": "CELLULAR_DATA_PIPELINE_ONLINE",
          "acceptableAnswers": [
            "CELLULAR_DATA_PIPELINE_ONLINE",
            "ONLINE"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
          "diagnosisMap": {
            "OFFLINE": {
              "misconceptionId": "MC_IOTNET_CELLULAR_AT_COMMANDS_PARSER_STATE_MACHINE",
              "errorExplanation": "Matches CELLULAR_DATA_PIPELINE_ONLINE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CELLULAR_DATA_PIPELINE_ONLINE.",
                "guidedFixPrompt": "Type CELLULAR_DATA_PIPELINE_ONLINE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Wireless Security: Replay Attacks, Frame Counters & Jamming",
    "overviewMetaphor": "Wireless Security is an armored bank courier: an eavesdropper with a software-defined radio can record an authentic 'OPEN GATE' command transmitted over 433 MHz and replay it at midnight to burglarize the factory (Replay Attack!); by stamping each frame with a strictly monotonic incrementing counter and AES-128-CCM* cryptographic message authentication code (MIC), the receiver rejects any packet with an old counter number; if an adversary blasts white noise across the frequency to jam transmissions, anomaly algorithms flag the noise floor spike instantly.",
    "blocks": [
      {
        "id": "iotnet-d25-b1-monotonic-frame-counters",
        "day": 25,
        "blockNumber": 1,
        "title": "Monotonic Frame Counters & Nonce Assembly",
        "conceptBudget": {
          "primaryConcept": "Monotonic Frame Counters",
          "supportingTerms": [
            "Strictly Increasing Frame Counter (`FCntUp` / `FCntDown`)",
            "Nonce Construction (DevAddr + FCnt + Direction + Zero padding forms AES IV)",
            "Zero Replay Window Tolerance in High-Security Actuators"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d10-b2-devnonce-replay-protection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Frame Counter Verification Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Receiver receives RF frame with counter N",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Is N > last_verified_counter? -> NO -> DROP REPLAY ATTACK!",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Verify AES-128-CCM* MIC signature using N in Nonce IV",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Update last_verified_counter = N -> Process payload!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "frame_counter_demo.js",
            "initialCode": "function verifyFrameCounter(lastCounter, incomingCounter) {\n  if (incomingCounter <= lastCounter) {\n    return { valid: false, error: 'REPLAY_ATTACK_DETECTED_PACKET_DROPPED' };\n  }\n  return {\n    valid: true,\n    updatedCounter: incomingCounter,\n    status: 'FRAME_AUTHENTICATED_ACCEPTED'\n  };\n}\n\nconsole.log(JSON.stringify(verifyFrameCounter(100, 101)));\nconsole.log(JSON.stringify(verifyFrameCounter(100, 100))); // Replay",
            "expectedOutput": "{\"valid\":true,\"updatedCounter\":101,\"status\":\"FRAME_AUTHENTICATED_ACCEPTED\"}\n{\"valid\":false,\"error\":\"REPLAY_ATTACK_DETECTED_PACKET_DROPPED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error string is returned when a wireless packet arrives with counter 100 while the receiver's last verified counter is 100?",
          "expectedStringOutput": "REPLAY_ATTACK_DETECTED_PACKET_DROPPED",
          "acceptableAnswers": [
            "REPLAY_ATTACK_DETECTED_PACKET_DROPPED",
            "REPLAY_ATTACK_DETECTED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
          "diagnosisMap": {
            "ACCEPTED": {
              "misconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
              "errorExplanation": "Counter must be strictly greater than lastCounter.",
              "recoveryPath": {
                "simplerExplanation": "Replay attack is dropped.",
                "guidedFixPrompt": "Type REPLAY_ATTACK_DETECTED_PACKET_DROPPED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d25-b2-rf-jamming-detection",
        "day": 25,
        "blockNumber": 2,
        "title": "RF Jamming Detection & RSSI Noise Floor Anomaly Tracking",
        "conceptBudget": {
          "primaryConcept": "RF Jamming Detection",
          "supportingTerms": [
            "RSSI Noise Floor Threshold (Normal $-110\\text{ dBm} \\implies$ Jamming spike to $-60\\text{ dBm}$)",
            "Channel Clear Assessment (CCA) failure rate",
            "Autonomous Channel Hopping / Cellular Failover Alert"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d25-b1-monotonic-frame-counters",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "jamming_demo.js",
            "initialCode": "function evaluateJammingThreat(noiseFloorDbm, thresholdDbm = -75) {\n  return (noiseFloorDbm >= thresholdDbm)\n    ? 'RF_JAMMING_ATTACK_DETECTED_INITIATE_FAILOVER'\n    : 'RF_SPECTRUM_CLEAR_NOMINAL';\n}\n\nconsole.log(evaluateJammingThreat(-105));\nconsole.log(evaluateJammingThreat(-55));",
            "expectedOutput": "RF_SPECTRUM_CLEAR_NOMINAL\nRF_JAMMING_ATTACK_DETECTED_INITIATE_FAILOVER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security alert is triggered when the RF noise floor spikes to -55 dBm (exceeding the -75 dBm threshold)?",
          "expectedStringOutput": "RF_JAMMING_ATTACK_DETECTED_INITIATE_FAILOVER",
          "acceptableAnswers": [
            "RF_JAMMING_ATTACK_DETECTED_INITIATE_FAILOVER",
            "RF_JAMMING_ATTACK_DETECTED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
          "diagnosisMap": {
            "CLEAR": {
              "misconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
              "errorExplanation": "-55 dBm is a severe noise floor spike indicating an active jamming attack.",
              "recoveryPath": {
                "simplerExplanation": "Spike triggers jamming failover alert.",
                "guidedFixPrompt": "Type RF_JAMMING_ATTACK_DETECTED_INITIATE_FAILOVER"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d25-b3-key-rotation-and-tamper-zeroization",
        "day": 25,
        "blockNumber": 3,
        "title": "Cryptographic Key Rotation & Hardware Tamper Zeroization",
        "conceptBudget": {
          "primaryConcept": "Key Zeroization & Rotation",
          "supportingTerms": [
            "Secure Element (ATECC608 / SE050)",
            "Tamper Pin Trigger (Chassis opening wipes internal SRAM keys in 5 microseconds)",
            "Periodic Session Re-Keying"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d25-b2-rf-jamming-detection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zeroization_demo.js",
            "initialCode": "function evaluateTamperSensor(tamperTripped, keyBuffer) {\n  if (tamperTripped) {\n    keyBuffer.fill(0);\n    return { keysZeroized: true, status: 'HARDWARE_TAMPER_KEY_ZEROIZED_SECURE' };\n  }\n  return { keysZeroized: false, status: 'KEYS_SECURE_NOMINAL' };\n}\n\nconst k = [0xAA, 0xBB, 0xCC];\nconsole.log(JSON.stringify(evaluateTamperSensor(true, k)));",
            "expectedOutput": "{\"keysZeroized\":true,\"status\":\"HARDWARE_TAMPER_KEY_ZEROIZED_SECURE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that cryptographic keys have been erased from memory following a physical chassis tamper trigger?",
          "expectedStringOutput": "HARDWARE_TAMPER_KEY_ZEROIZED_SECURE",
          "acceptableAnswers": [
            "HARDWARE_TAMPER_KEY_ZEROIZED_SECURE",
            "status\":\"HARDWARE_TAMPER_KEY_ZEROIZED_SECURE\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_RADIO_JAMMING_REPLAY_ATTACK_DEFENSES",
              "errorExplanation": "Matches HARDWARE_TAMPER_KEY_ZEROIZED_SECURE.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDWARE_TAMPER_KEY_ZEROIZED_SECURE.",
                "guidedFixPrompt": "Type HARDWARE_TAMPER_KEY_ZEROIZED_SECURE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Firmware Over-The-Air (FOTA / FUOTA) Multicast Updates",
    "overviewMetaphor": "FUOTA is dropping jigsaw puzzle pieces from a blimp over 1,000 houses at once: sending a 200 KB firmware update individually to 1,000 nodes would take 3 months of radio airtime (Breaking duty cycle laws!); LoRaWAN FUOTA creates a temporary Multicast Group so all 1,000 devices listen simultaneously; it uses Reed-Solomon Erasure Coding (If 20 out of 120 fragments get lost in the wind, devices mathematically reconstruct the missing 20 pieces without asking for a retransmission).",
    "blocks": [
      {
        "id": "iotnet-d26-b1-fuota-multicast-group-setup",
        "day": 26,
        "blockNumber": 1,
        "title": "LoRaWAN FUOTA: Multicast Setup & Clock Synchronization",
        "conceptBudget": {
          "primaryConcept": "FUOTA Multicast Architecture",
          "supportingTerms": [
            "Multicast Setup Protocol (Assigns temporary `McAddr` and `McKey` to device fleet)",
            "Application Clock Synchronization (`AppTimeReq` / `AppTimeAns` for sub-second sync)",
            "Switching Class A devices to Class B/C multicast listening windows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d11-b1-class-a-rx-window-timing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "FUOTA Multicast Update Phases",
              "nodes": [
                {
                  "id": "1",
                  "label": "Clock Sync: Synchronize device RTC clocks to Network Time via AppTime",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Multicast Group Setup: Deploy McAddr & McKey to 10,000 devices",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Fragmentation Session: Devices enter Class C listening window at scheduled time",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Gateway broadcasts erasure-coded firmware fragments once -> All devices receive!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fuota_setup_demo.js",
            "initialCode": "function evaluateFuotaMulticast(deviceCount, multicastEnabled) {\n  return {\n    targetDevices: deviceCount,\n    multicastActive: multicastEnabled,\n    singleBroadcastTransmission: true,\n    status: 'FUOTA_MULTICAST_GROUP_PREPARED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFuotaMulticast(10000, true)));",
            "expectedOutput": "{\"targetDevices\":10000,\"multicastActive\":true,\"singleBroadcastTransmission\":true,\"status\":\"FUOTA_MULTICAST_GROUP_PREPARED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a multicast group is prepared to broadcast firmware to 10,000 devices in a single transmission?",
          "expectedStringOutput": "FUOTA_MULTICAST_GROUP_PREPARED",
          "acceptableAnswers": [
            "FUOTA_MULTICAST_GROUP_PREPARED",
            "status\":\"FUOTA_MULTICAST_GROUP_PREPARED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
              "errorExplanation": "Matches FUOTA_MULTICAST_GROUP_PREPARED.",
              "recoveryPath": {
                "simplerExplanation": "Matches FUOTA_MULTICAST_GROUP_PREPARED.",
                "guidedFixPrompt": "Type FUOTA_MULTICAST_GROUP_PREPARED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d26-b2-reed-solomon-erasure-coding",
        "day": 26,
        "blockNumber": 2,
        "title": "Reed-Solomon Erasure Coding & Loss-Tolerant Reconstruction",
        "conceptBudget": {
          "primaryConcept": "Erasure Coding Reconstruction",
          "supportingTerms": [
            "Source Fragments $K$ (Base firmware payload split into $K$ chunks, e.g. 100 fragments)",
            "Redundancy Fragments $M$ (Forward Error Correction parity chunks, e.g. 20 fragments)",
            "Any-$K$-of-$(K+M)$ Reconstruction Property (Receiving ANY 100 out of 120 fragments perfectly reconstructs firmware with zero retransmissions!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d26-b1-fuota-multicast-group-setup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "erasure_demo.js",
            "initialCode": "function evaluateErasureReconstruction(receivedChunks, requiredK = 100, redundancyM = 20) {\n  const success = receivedChunks >= requiredK;\n  const lossTolerated = (requiredK + redundancyM) - receivedChunks;\n  return {\n    receivedChunks,\n    requiredK,\n    lossToleratedCount: Math.max(0, lossTolerated),\n    reconstructionPossible: success,\n    status: success ? 'FIRMWARE_IMAGE_RECONSTRUCTED_100%' : 'INSUFFICIENT_FRAGMENTS'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateErasureReconstruction(105, 100, 20)));\nconsole.log(JSON.stringify(evaluateErasureReconstruction(95, 100, 20)));",
            "expectedOutput": "{\"receivedChunks\":105,\"requiredK\":100,\"lossToleratedCount\":15,\"reconstructionPossible\":true,\"status\":\"FIRMWARE_IMAGE_RECONSTRUCTED_100%\"}\n{\"receivedChunks\":95,\"requiredK\":100,\"lossToleratedCount\":25,\"reconstructionPossible\":false,\"status\":\"INSUFFICIENT_FRAGMENTS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Reed-Solomon Forward Error Correction (FEC) allow LoRaWAN nodes to complete firmware updates without sending individual ACK packets?",
          "options": [
            "The gateway broadcasts $K$ data fragments plus $M$ redundancy parity fragments; any node that receives ANY $K$ fragments can mathematically reconstruct the full firmware image, tolerating up to $M$ dropped packets with zero uplink retransmissions",
            "By uploading to USB drives",
            "By ignoring missing bytes"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
              "errorExplanation": "Any K of K+M fragments reconstructs the original firmware image.",
              "recoveryPath": {
                "simplerExplanation": "Receiving any K chunks reconstructs the firmware.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d26-b3-delta-compression-patching",
        "day": 26,
        "blockNumber": 3,
        "title": "Delta Compression & Binary Differencing (bsdiff / courgette)",
        "conceptBudget": {
          "primaryConcept": "Delta Firmware Patching",
          "supportingTerms": [
            "Binary Differencing (Transmitting only the difference $\\Delta = v2 - v1$)",
            "90% Payload Reduction (200 KB firmware $\\to$ 15 KB delta patch)",
            "SHA-256 integrity verification before flashing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d26-b2-reed-solomon-erasure-coding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "delta_patch_demo.js",
            "initialCode": "function evaluateDeltaPatch(fullFwBytes = 250000, deltaBytes = 18000) {\n  const savingsPercent = ((fullFwBytes - deltaBytes) / fullFwBytes) * 100;\n  return {\n    fullFirmwareBytes: fullFwBytes,\n    deltaPatchBytes: deltaBytes,\n    bandwidthReductionPercent: Number(savingsPercent.toFixed(1)),\n    status: 'DELTA_COMPRESSION_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDeltaPatch()));",
            "expectedOutput": "{\"fullFirmwareBytes\":250000,\"deltaPatchBytes\":18000,\"bandwidthReductionPercent\":92.8,\"status\":\"DELTA_COMPRESSION_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved when transmitting an 18 KB delta patch instead of a 250 KB full firmware image?",
          "expectedStringOutput": "92.8",
          "acceptableAnswers": [
            "92.8",
            "92.8%",
            "bandwidthReductionPercent\":92.8"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOTNET_ROAMING_MULTICAST_FIRMWARE_OTA_FUOTA",
              "errorExplanation": "(250000 - 18000) / 250000 = 92.8% reduction.",
              "recoveryPath": {
                "simplerExplanation": "Reduces airtime by 92.8%.",
                "guidedFixPrompt": "Type 92.8"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Energy Harvesting & Solar/Thermal Duty Cycling",
    "overviewMetaphor": "Energy Harvesting IoT is a Waterwheel Grain Mill: instead of hauling heavy bags of batteries into the wilderness every 2 years, a tiny 50 mm solar cell or thermoelectric Peltier generator trickles micro-joules of energy into a supercapacitor reservoir; an Energy-Neutral Duty Cycle algorithm calculates the inflow rate (Inflow = 0.5 mW); it only fires a wireless radio transmission when the capacitor is fully charged, achieving perpetual 30-year maintenance-free operation.",
    "blocks": [
      {
        "id": "iotnet-d27-b1-energy-neutral-operation-ino",
        "day": 27,
        "blockNumber": 1,
        "title": "Energy Neutral Operation (ENO) & Power Inflow Math",
        "conceptBudget": {
          "primaryConcept": "Energy Neutral Operation (ENO)",
          "supportingTerms": [
            "Energy Invariant ($E_{\\text{harvested}}(T) \\ge E_{\\text{consumed}}(T)$ over cycle $T$)",
            "Harvesting Sources: Solar Indoor/Outdoor ($10\\text{ uW/cm}^2$ to $100\\text{ mW/cm}^2$), Thermal TEG ($20-50\\text{ uW/cm}^2$)",
            "Energy-Aware Dynamic Duty Cycling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d14-b3-battery-lifecycle-ten-year-goal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ENO Equilibrium Equation",
            "codeSnippet": "// Energy In = P_harvest * T\n// Energy Out = E_active + P_sleep * (T - T_active)\n// Equilibrium Transmission Interval: T = (E_active - P_sleep * T_active) / (P_harvest - P_sleep)",
            "lineNotes": {
              "3": "Calculates minimum sustainable transmission interval in seconds."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eno_calc_demo.js",
            "initialCode": "function calculateEnoInterval(harvestPowerMw, txJoules = 0.005, sleepMw = 0.005) {\n  const netHarvest = (harvestPowerMw - sleepMw) / 1000; // Watts\n  if (netHarvest <= 0) return { sustainable: false, status: 'ENERGY_DEFICIT' };\n  const intervalSec = txJoules / netHarvest;\n  return {\n    harvestPowerMw,\n    minIntervalSeconds: Number(intervalSec.toFixed(1)),\n    sustainable: true,\n    status: 'ENERGY_NEUTRAL_SUSTAINABLE'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEnoInterval(0.5, 0.005, 0.005)));",
            "expectedOutput": "{\"harvestPowerMw\":0.5,\"minIntervalSeconds\":10.1,\"sustainable\":true,\"status\":\"ENERGY_NEUTRAL_SUSTAINABLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sustainable transmission interval (in seconds) when harvesting 0.5 mW with 5 mJ TX pulses and 5 uW sleep power?",
          "expectedStringOutput": "10.1",
          "acceptableAnswers": [
            "10.1",
            "10.1s",
            "10.1 seconds",
            "minIntervalSeconds\":10.1"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
              "errorExplanation": "0.005 J / 0.000495 W = 10.1 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Interval = 10.1 seconds.",
                "guidedFixPrompt": "Type 10.1"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d27-b2-supercapacitor-charge-curves",
        "day": 27,
        "blockNumber": 2,
        "title": "Supercapacitor Energy Storage & Leakage Current",
        "conceptBudget": {
          "primaryConcept": "Supercapacitor Energy Storage",
          "supportingTerms": [
            "Stored Energy: $E = \\frac{1}{2} C V^2$",
            "Usable Energy: $E_{\\text{usable}} = \\frac{1}{2} C (V_{\\text{max}}^2 - V_{\\text{min}}^2)$",
            "Self-discharge / Leakage Current (Typically $1-3\\text{ uA}$)",
            "Zero cycle degradation (1,000,000+ charge cycles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d27-b1-energy-neutral-operation-ino",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "supercap_demo.js",
            "initialCode": "function calculateSupercapEnergy(farads, vMax = 3.3, vMin = 2.0) {\n  const totalJoules = 0.5 * farads * (vMax * vMax);\n  const usableJoules = 0.5 * farads * (vMax * vMax - vMin * vMin);\n  return {\n    capacitanceFarads: farads,\n    totalStoredJoules: Number(totalJoules.toFixed(3)),\n    usableEnergyJoules: Number(usableJoules.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(calculateSupercapEnergy(1.0)));",
            "expectedOutput": "{\"capacitanceFarads\":1,\"totalStoredJoules\":5.445,\"usableEnergyJoules\":3.445}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the usable energy in Joules stored in a 1.0 Farad supercapacitor between 3.3V and 2.0V ($0.5 \\times 1.0 \\times (3.3^2 - 2.0^2)$)?",
          "expectedStringOutput": "3.445",
          "acceptableAnswers": [
            "3.445",
            "3.445 J",
            "usableEnergyJoules\":3.445"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
          "diagnosisMap": {
            "5.445": {
              "misconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
              "errorExplanation": "5.445 J is total energy down to 0V. Usable energy down to 2.0V is 3.445 J.",
              "recoveryPath": {
                "simplerExplanation": "Usable energy = 3.445 Joules.",
                "guidedFixPrompt": "Type 3.445"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d27-b3-mppt-harvester-pmics",
        "day": 27,
        "blockNumber": 3,
        "title": "Maximum Power Point Tracking (MPPT) PMICs (BQ25570 / ADP5091)",
        "conceptBudget": {
          "primaryConcept": "MPPT Harvester PMICs",
          "supportingTerms": [
            "Maximum Power Point Tracking (MPPT: Samples open-circuit voltage $V_{\\text{OC}}$ every 16s)",
            "Solar MPP ($70-80\\% \\times V_{\\text{OC}}$)",
            "Cold-Start Voltage ($330\\text{ mV}$ boots from completely dead capacitor)",
            "Buck regulator output (Regulated 3.3V at 90% efficiency)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d27-b2-supercapacitor-charge-curves",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mppt_pmic_demo.js",
            "initialCode": "function evaluateMpptPmic(vocVolts, mpptRatio = 0.80) {\n  const vMpp = vocVolts * mpptRatio;\n  return {\n    openCircuitVoltage: vocVolts,\n    regulatedMppVoltage: Number(vMpp.toFixed(3)),\n    harvesterStatus: 'MPPT_MAXIMUM_ENERGY_TRANSFER_ACTIVE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMpptPmic(2.5, 0.80)));",
            "expectedOutput": "{\"openCircuitVoltage\":2.5,\"regulatedMppVoltage\":2,\"harvesterStatus\":\"MPPT_MAXIMUM_ENERGY_TRANSFER_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What MPP voltage is tracked by an MPPT harvester PMIC configured for 80% ratio on a 2.5V solar cell?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2V",
            "regulatedMppVoltage\":2"
          ],
          "primaryMisconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
          "diagnosisMap": {
            "2.5": {
              "misconceptionId": "MC_IOTNET_ENERGY_HARVESTING_DUTY_CYCLING_OPTIMIZATION",
              "errorExplanation": "2.5 * 0.80 = 2.0V MPP tracking voltage.",
              "recoveryPath": {
                "simplerExplanation": "2.5 * 0.80 = 2.0V.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Satellite IoT & Direct-to-Cell LEO Constellations",
    "overviewMetaphor": "Direct-to-Satellite IoT is throwing a ball to a supersonic jet flying 500 km overhead: Low Earth Orbit (LEO) satellites race across the sky at 7.5 kilometers per second ($27,000\\text{ km/h}$); because the satellite moves so fast, the radio frequency shifts by up to 22 kHz as it approaches and recedes (Doppler Shift); ground sensors predict the exact 7-minute pass window using orbital mechanics (Two-Line Element sets TLE), pre-compensating frequency so marine buoys and desert pipelines transmit directly to space.",
    "blocks": [
      {
        "id": "iotnet-d28-b1-leo-orbital-dynamics-and-pass-windows",
        "day": 28,
        "blockNumber": 1,
        "title": "LEO Constellations (500-800 km) & Visibility Pass Windows",
        "conceptBudget": {
          "primaryConcept": "LEO Constellation Pass Windows",
          "supportingTerms": [
            "Low Earth Orbit (LEO: 500 - 800 km altitude)",
            "Orbital Velocity ($v \\approx 7.5\\text{ km/s}$, 90-minute orbit)",
            "Pass Window (5 to 10 minutes of visibility above $10^{\\circ}$ elevation horizon)",
            "Constellations: Starlink Direct-to-Cell, Iridium NEXT, Astrocast, Myriota"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d1-b1-rf-spectrum-subghz-vs-24ghz",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LEO Satellite Pass Parameters",
              "boxes": [
                {
                  "label": "1. Orbital Altitude",
                  "value": "550 km | Orbital Period: ~95 minutes | Ground Speed: 7.5 km/s",
                  "varType": "LEO Orbit",
                  "isUpdated": false
                },
                {
                  "label": "2. Pass Window Duration",
                  "value": "6 - 8 minutes per pass | Max Elevation: 65 degrees | Ground Footprint: ~1,500 km radius",
                  "varType": "Pass Window",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sat_pass_demo.js",
            "initialCode": "function evaluateSatellitePass(elevationDeg) {\n  return (elevationDeg >= 10)\n    ? 'SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED'\n    : 'SATELLITE_BELOW_HORIZON_WAIT_FOR_NEXT_ORBIT';\n}\n\nconsole.log(evaluateSatellitePass(45));\nconsole.log(evaluateSatellitePass(5));",
            "expectedOutput": "SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED\nSATELLITE_BELOW_HORIZON_WAIT_FOR_NEXT_ORBIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What link status is achieved when a LEO satellite reaches 45 degrees elevation above the ground horizon?",
          "expectedStringOutput": "SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED",
          "acceptableAnswers": [
            "SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED",
            "SATELLITE_LINK_ACQUIRED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
          "diagnosisMap": {
            "BELOW": {
              "misconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
              "errorExplanation": "45 degrees is well above the 10-degree horizon threshold.",
              "recoveryPath": {
                "simplerExplanation": "Above 10 deg -> SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED.",
                "guidedFixPrompt": "Type SATELLITE_LINK_ACQUIRED: DIRECT_UPLINK_PERMITTED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d28-b2-doppler-shift-compensation",
        "day": 28,
        "blockNumber": 2,
        "title": "Doppler Shift Math & Frequency Pre-Compensation",
        "conceptBudget": {
          "primaryConcept": "Doppler Shift Compensation",
          "supportingTerms": [
            "Doppler Formula ($\\Delta f = f_0 \\frac{v_{\\text{rel}}}{c}$)",
            "High Frequency Shift (At 868 MHz, $7.5\\text{ km/s} \\implies \\pm 21.7\\text{ kHz}$ shift during pass!)",
            "Ground transmitter frequency pre-compensation (Stepping transmit frequency to match satellite receiver)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d28-b1-leo-orbital-dynamics-and-pass-windows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LEO Doppler Frequency Shift Formula",
            "codeSnippet": "const c = 299792458; // Speed of light in m/s\nconst vRel = 7500; // Satellite relative velocity in m/s\nconst maxDopplerHz = (vRel / c) * carrierFreqHz;\n// Ground transmitter pre-shifts center frequency by -maxDoppler to lock into receiver PLL!",
            "lineNotes": {
              "3": "Calculates maximum frequency shift in Hertz."
            }
          },
          {
            "type": "runnable_code",
            "filename": "doppler_calc_demo.js",
            "initialCode": "function calculateDoppler(fHz = 868000000, v = 7500) {\n  const c = 299792458;\n  const maxDoppler = (v / c) * fHz;\n  return {\n    carrierHz: fHz,\n    maxDopplerHz: Number(maxDoppler.toFixed(1)),\n    maxDopplerKhz: Number((maxDoppler / 1000).toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateDoppler(868000000)));",
            "expectedOutput": "{\"carrierHz\":868000000,\"maxDopplerHz\":21715.0,\"maxDopplerKhz\":21.72}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum Doppler frequency shift in kilohertz for an 868 MHz satellite link at 7.5 km/s ($868 \\times 10^6 \\times 7500 / 3 \\times 10^8$)?",
          "expectedStringOutput": "21.72",
          "acceptableAnswers": [
            "21.72",
            "21.72 kHz",
            "21.7 kHz",
            "maxDopplerKhz\":21.72"
          ],
          "primaryMisconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
              "errorExplanation": "Shift is approximately 21.72 kHz.",
              "recoveryPath": {
                "simplerExplanation": "Doppler shift = 21.72 kHz.",
                "guidedFixPrompt": "Type 21.72"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d28-b3-satellite-link-budget-margin",
        "day": 28,
        "blockNumber": 3,
        "title": "Satellite Space Link Budget: 550 km FSPL & Polarization Loss",
        "conceptBudget": {
          "primaryConcept": "Satellite Link Budget",
          "supportingTerms": [
            "Space FSPL (550 km at 868 MHz $\\implies 146\\text{ dB}$ Free Space Path Loss)",
            "Circular Polarization (RHCP / LHCP avoiding Faraday rotation ionosphere loss)",
            "Ultra-Narrowband / LoRa Modulation Sensitivity ($-137\\text{ dBm}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d28-b2-doppler-shift-compensation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sat_budget_demo.js",
            "initialCode": "function evaluateSatLink(txPowerDbm = 22, txGain = 2, rxGain = 10, pathLossDb = 146, sensitivity = -137) {\n  const rxPower = txPowerDbm + txGain + rxGain - pathLossDb;\n  const margin = rxPower - sensitivity;\n  return {\n    receivedPowerDbm: rxPower,\n    linkMarginDb: Number(margin.toFixed(1)),\n    linkFeasible: margin >= 0,\n    status: margin >= 0 ? 'SPACE_LINK_BUDGET_CLOSED' : 'SPACE_SIGNAL_LOST'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSatLink(22, 2, 10, 146, -137)));",
            "expectedOutput": "{\"receivedPowerDbm\":-112,\"linkMarginDb\":25,\"linkFeasible\":true,\"status\":\"SPACE_LINK_BUDGET_CLOSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What link status confirms a positive +25 dB margin across a 550 km LEO satellite space uplink?",
          "expectedStringOutput": "SPACE_LINK_BUDGET_CLOSED",
          "acceptableAnswers": [
            "SPACE_LINK_BUDGET_CLOSED",
            "status\":\"SPACE_LINK_BUDGET_CLOSED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
          "diagnosisMap": {
            "LOST": {
              "misconceptionId": "MC_IOTNET_SATELLITE_IOT_DORBIT_PROPAGATION_LINK_BUDGET",
              "errorExplanation": "Positive 25 dB margin satisfies SPACE_LINK_BUDGET_CLOSED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPACE_LINK_BUDGET_CLOSED.",
                "guidedFixPrompt": "Type SPACE_LINK_BUDGET_CLOSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Edge Network Failover & Mesh Self-Healing Orchestration",
    "overviewMetaphor": "Multi-WAN Edge Failover is an emergency backup electrical grid in a hospital: under normal conditions, the building runs on cheap municipal grid power (Ethernet / Wi-Fi); if a storm cuts the power line, the system switches instantly to backup diesel generators (Cellular LTE-M); if the cell tower loses power, emergency solar satellite radios take over; health check pings test every path every 5 seconds so transitions occur without dropping a single packet.",
    "blocks": [
      {
        "id": "iotnet-d29-b1-multi-wan-failover-orchestration",
        "day": 29,
        "blockNumber": 1,
        "title": "Multi-WAN Priority Routing: Ethernet $\\to$ Wi-Fi $\\to$ Cellular $\\to$ Satellite",
        "conceptBudget": {
          "primaryConcept": "Multi-WAN Priority Failover",
          "supportingTerms": [
            "Interface Priority (1: Ethernet, 2: Wi-Fi, 3: Cellular LTE-M, 4: Satellite LEO)",
            "Active Liveness Probing (DNS / ICMP health check pings every 5s)",
            "Failback Hysteresis (Wait for primary link to be stable for 60s before switching back)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d28-b1-leo-orbital-dynamics-and-pass-windows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Edge Gateway Multi-WAN Failover Ladder",
              "nodes": [
                {
                  "id": "1",
                  "label": "Is Ethernet online? -> YES -> Route all traffic over Primary Ethernet (Cost $0)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Ethernet fails? -> Switch to Secondary Wi-Fi in 200 ms",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Wi-Fi fails? -> Activate Cellular LTE-M PPP/ECM interface",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Cellular fails? -> Dispatch critical telemetry via Satellite LEO pass!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "multiwan_demo.js",
            "initialCode": "function evaluateWanRoutes(ifaces) {\n  const active = ifaces.filter(i => i.online).sort((a, b) => a.prio - b.prio);\n  if (active.length === 0) return { connected: false, route: 'OFFLINE_ISOLATED' };\n  return {\n    connected: true,\n    activeInterface: active[0].name,\n    status: `ROUTING_OVER_${active[0].name}`\n  };\n}\n\nconst ifaces = [\n  { name: 'ETH', online: false, prio: 1 },\n  { name: 'WIFI', online: false, prio: 2 },\n  { name: 'CELL', online: true, prio: 3 },\n  { name: 'SAT', online: true, prio: 4 }\n];\nconsole.log(JSON.stringify(evaluateWanRoutes(ifaces)));",
            "expectedOutput": "{\"connected\":true,\"activeInterface\":\"CELL\",\"status\":\"ROUTING_OVER_CELL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which WAN interface is selected when Ethernet and Wi-Fi are offline, but Cellular (Priority 3) and Satellite (Priority 4) are online?",
          "expectedStringOutput": "CELL",
          "acceptableAnswers": [
            "CELL",
            "activeInterface\":\"CELL\"",
            "Cellular"
          ],
          "primaryMisconceptionId": "MC_IOTNET_EDGE_COMMUNICATION_FAILOVER_HEARTBEATS",
          "diagnosisMap": {
            "SAT": {
              "misconceptionId": "MC_IOTNET_EDGE_COMMUNICATION_FAILOVER_HEARTBEATS",
              "errorExplanation": "Cellular has higher priority (3 < 4) than Satellite.",
              "recoveryPath": {
                "simplerExplanation": "Cellular is chosen before Satellite.",
                "guidedFixPrompt": "Type CELL"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d29-b2-mesh-self-healing-parent-switch",
        "day": 29,
        "blockNumber": 2,
        "title": "Mesh Self-Healing: Autonomous Parent Switching & Dead Peer Detection",
        "conceptBudget": {
          "primaryConcept": "Mesh Self-Healing Parent Switching",
          "supportingTerms": [
            "Dead Peer Detection (DPD: 3 missed ACKs flags parent as dead)",
            "Candidate Parent Table",
            "Autonomous Fast Parent Switch (Under 250 ms without dropping network association)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d29-b1-multi-wan-failover-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "self_heal_demo.js",
            "initialCode": "function evaluateMeshHealth(missedAcks, candidateParents) {\n  if (missedAcks >= 3) {\n    candidateParents.sort((a, b) => a.lqi - b.lqi);\n    const newParent = candidateParents[candidateParents.length - 1];\n    return {\n      parentFailed: true,\n      newParentSelected: newParent.id,\n      status: 'MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS'\n    };\n  }\n  return { parentFailed: false, status: 'PARENT_LINK_HEALTHY' };\n}\n\nconst parents = [{ id: 'Router_B', lqi: 150 }, { id: 'Router_C', lqi: 230 }];\nconsole.log(JSON.stringify(evaluateMeshHealth(3, parents)));",
            "expectedOutput": "{\"parentFailed\":true,\"newParentSelected\":\"Router_C\",\"status\":\"MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms autonomous mesh parent failover following 3 missed ACKs?",
          "expectedStringOutput": "MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS",
          "acceptableAnswers": [
            "MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS",
            "status\":\"MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_MESH_SELF_HEALING_TOPOLOGY_DISCOVERY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_MESH_SELF_HEALING_TOPOLOGY_DISCOVERY",
              "errorExplanation": "Matches MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS.",
                "guidedFixPrompt": "Type MESH_AUTONOMOUS_PARENT_FAILOVER_SUCCESS"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d29-b3-dynamic-dns-and-heartbeat-keepalive",
        "day": 29,
        "blockNumber": 3,
        "title": "Dynamic DNS, Heartbeat Keepalives & Cloud Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Edge Heartbeat & Keepalive Invariant",
          "supportingTerms": [
            "Heartbeat Keepalive Pings (Interval $T_{\\text{ping}} = 60\\text{s}$)",
            "Cloud Connection State Machine",
            "Zero Blind Spot Telemetry Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d29-b2-mesh-self-healing-parent-switch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "heartbeat_demo.js",
            "initialCode": "function evaluateHeartbeat(lastSeenSec, maxThresholdSec = 120) {\n  return (lastSeenSec <= maxThresholdSec)\n    ? 'EDGE_GATEWAY_ONLINE_HEALTHY'\n    : 'EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM';\n}\n\nconsole.log(evaluateHeartbeat(45));\nconsole.log(evaluateHeartbeat(180));",
            "expectedOutput": "EDGE_GATEWAY_ONLINE_HEALTHY\nEDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What alarm is triggered when an edge gateway misses heartbeats for 180 seconds (exceeding the 120s limit)?",
          "expectedStringOutput": "EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM",
          "acceptableAnswers": [
            "EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM",
            "TIMEOUT_ALARM"
          ],
          "primaryMisconceptionId": "MC_IOTNET_EDGE_COMMUNICATION_FAILOVER_HEARTBEATS",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_IOTNET_EDGE_COMMUNICATION_FAILOVER_HEARTBEATS",
              "errorExplanation": "180s exceeds the 120s threshold, triggering EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM.",
              "recoveryPath": {
                "simplerExplanation": "Triggers EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM.",
                "guidedFixPrompt": "Type EDGE_GATEWAY_HEARTBEAT_TIMEOUT_ALARM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete city-scale IoT wireless communications ecosystem: 1. BLE Mesh environmental sensor arrays; 2. LoRaWAN long-range municipal utility telemetry; 3. Cellular NB-IoT / LTE-M multi-WAN gateway uplinks; 4. CoAP / DTLS-PSK end-to-end encrypted packet streams; 5. 6LoWPAN IPv6 header compression; 6. Energy-harvesting autonomous solar nodes; 7. Satellite emergency failover.",
    "blocks": [
      {
        "id": "iotnet-d30-b1-smart-city-architecture-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Smart City Multi-Radio Ecosystem Architecture",
        "conceptBudget": {
          "primaryConcept": "Smart City Multi-Radio Architecture",
          "supportingTerms": [
            "Multi-Radio Mesh Network",
            "LoRaWAN City Infrastructure",
            "Cellular & Satellite Gateway Uplinks",
            "End-to-End DTLS Security"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d29-b1-multi-wan-failover-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise Smart City Multi-Radio Ecosystem Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "BLE Mesh streetlights collect pedestrian traffic & environmental air quality",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "LoRaWAN gateways aggregate water, gas, and structural health telemetry across 20 km",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Edge gateways compress (6LoWPAN) & encrypt (DTLS-PSK) packets",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Multi-WAN routers stream data via Ethernet/Cellular with LEO Satellite failover!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestrator_demo.js",
            "initialCode": "function runSmartCityEcosystem() {\n  return {\n    bleMeshSubsystem: '250_NODES_FLOODING_ACTIVE',\n    lorawanSubsystem: '8_GATEWAYS_DEDUPLICATING_UPLINKS',\n    cellularUplink: 'LTE_M_PDP_CONTEXT_ONLINE',\n    satelliteBackup: 'LEO_PASS_TRACKING_STANDBY',\n    securityLayer: 'DTLS_PSK_AES_CCM_AUTHENTICATED',\n    ecosystemStatus: 'SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED'\n  };\n}\n\nconsole.log(runSmartCityEcosystem().ecosystemStatus);",
            "expectedOutput": "SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ecosystem status confirms operational synthesis of the Enterprise Smart City Multi-Radio Wireless Mesh Ecosystem?",
          "expectedStringOutput": "SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED",
          "acceptableAnswers": [
            "SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED",
            "ecosystemStatus: SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
              "errorExplanation": "Matches SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED.",
                "guidedFixPrompt": "Type SMART_CITY_WIRELESS_ECOSYSTEM_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d30-b2-smart-city-ecosystem-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Smart City Wireless Ecosystem Production Quality Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Production Quality Audit",
          "supportingTerms": [
            "Sub-GHz / 2.4 GHz Coexistence",
            "Zero Drop Failover Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d30-b1-smart-city-architecture-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditSmartCityEcosystem(radioLayers, multiWanOnline, dtlsEncrypted) {\n  const allPassed = (radioLayers >= 4) && multiWanOnline && dtlsEncrypted;\n  return {\n    radioLayersCount: radioLayers,\n    multiWanOnline,\n    dtlsEncrypted,\n    finalGrade: allPassed ? 'ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSmartCityEcosystem(4, true, true)));",
            "expectedOutput": "{\"radioLayersCount\":4,\"multiWanOnline\":true,\"dtlsEncrypted\":true,\"finalGrade\":\"ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final grade confirms full certification of the Smart City Wireless Ecosystem?",
          "expectedStringOutput": "ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED",
            "finalGrade\":\"ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
              "errorExplanation": "All checks passed awards ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_IOT_NETWORKS_100_PERCENT_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iotnet-d30-b3-final-capstone-iotnet-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Course 14: IoT Wireless Networks & Protocols Master Certification",
        "conceptBudget": {
          "primaryConcept": "Course 14 Master Certification",
          "supportingTerms": [
            "Course 14 Fully Certified",
            "Zero Defect Gold Standard"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotnet-d30-b2-smart-city-ecosystem-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_iotnet_cert.js",
            "initialCode": "console.log('🏆 COURSE 14 MASTER CERTIFICATION: IoT Wireless Networks & Protocols [COMPLETED 100%]');",
            "expectedOutput": "🏆 COURSE 14 MASTER CERTIFICATION: IoT Wireless Networks & Protocols [COMPLETED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms full completion of Course 14?",
          "expectedStringOutput": "🏆 COURSE 14 MASTER CERTIFICATION: IoT Wireless Networks & Protocols [COMPLETED 100%]",
          "acceptableAnswers": [
            "🏆 COURSE 14 MASTER CERTIFICATION: IoT Wireless Networks & Protocols [COMPLETED 100%]",
            "COMPLETED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTNET_CAPSTONE_SMART_CITY_MULTI_RADIO_ORCHESTRATION",
              "errorExplanation": "Matches course completion string.",
              "recoveryPath": {
                "simplerExplanation": "Matches course completion string.",
                "guidedFixPrompt": "Type 🏆 COURSE 14 MASTER CERTIFICATION: IoT Wireless Networks & Protocols [COMPLETED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];

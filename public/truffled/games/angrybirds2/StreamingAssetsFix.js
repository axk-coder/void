// fixes the streaming assets not working on some servers
// fix by TS (plz dont @)
// yea
// thank me later
// just embeds them into itself and intercepts it 
// instead of unity just going to the file via http
// this intercepts it
// and makes it work

(function () {
  var DATA = {
    "ArenaConfiguration.txt": `
{
	"ArenaRewards": 
		[
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 80
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 100
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 120
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 140
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 160
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 100
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 180
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 150
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 100
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 220
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 180
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 150
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 100
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			],
			[
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 300
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 300
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 150
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 200
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 75
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 180
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 50
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 150
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 25
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 100
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 10
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 75
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 5
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 50
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 25
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							},
							{
								"RewardKey": "Key-BlackPearls",
								"Amount": 10
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				},
				{
					"Rewards": 
						[
							{
								"RewardKey": "Key-Gems",
								"Amount": 0
							}
						]
				}
			]
		],
	"CardToLeagueLevel": 
		[
			"Vanilla",
			"Bronze",
			"Silver",
			"Gold",
			"Blue",
			"Green",
			"Purple",
			"Diamond"
		],
	"MinutesBetweenTickets": 180,
	"TicketsPerDay": 0,
	"MinRoomScore": 55000,
	"MaxRoomScore": 65000,
	"MaxBadThrowScore": 16000,
	"ChanceOfBadThrow": 0.2,
	"DestructionScorePerDestructible": 1000,
	"PvPMatchmakingFunction": "pvp_inv",
	
	"ArenaLevelConfig": 
		{
			"PigList": "Randomize/PigLists/PigList_Chapter01.txt",
			
			"NumberOfTNTs": 0,
			
			"LevelsPerDay": 20,
			
			"RoomsPerRun": 15
		}
}
`,
    "BrandedLevelEventSchedule.json": `
{
	"eventList":
	[
		{
			"campaignName": "BirthdayCampaign",

			"promotionStartDate": "2016-06-14 08:00",

			"promotionEndDate": "2016-06-20 23:59",

			"bonusLevelButtonAsset": "button",
			
			"tiledBackgroundAsset": "background",
			
			"useLocalization": true,
			
			"eventDurationInMinutes": 240,

			"chapterCollectionAssetName": "chapterDef",
			
			"eventPopup":
				{
					"title": "AN-BL-Level-Popup-Event-Title",
					"text1": "AN-BL-Level-Popup-Event-Message",
					"text2": null,
					"bannerAsset": "popupbg"
				},
			
			"payoffPopup": 
				{
					"title": "AN-BL-Level-Popup-Payoff-Title",
					"text1": "AN-BL-Level-Popup-Payoff-Message",
					"text2": null,
					"bannerAsset": "payoff",
					"url": "http://rov.io/ab2fbcompetition",
				},
			
			"assets":
				{
					"popupbg"		: "BirthdayCampaign/BL-birthday-event",
					"background"	: "BirthdayCampaign/BL-birthday-background",
					"payoff"		: "BirthdayCampaign/BL-birthday-payoff",
					"button"		: "BirthdayCampaign/BL-birthday-button",
					"chapterDef"	: "BirthdayCampaign/BonusChapters"
				}
		}
	]
}
`,
    "CrashFilters.txt": `
{
	"FilterConfigId":2900,
	"AppInfoIndexAndroid":0,
	"AppInfoIndexIOS":0,
	"RegexPatterns":
	[
		"SIGTRAP",
		"Stale touch detected"
	]
}
`,
    "GameMasterData.json": `
{
	"TweakData": 
		{
			"ConfigName": "0_Control"
		}
}
`,
    "LevelOverrides.txt": `
{
	"Levels" :
	[
	]
}
`,
    "LoadingTips.txt": `
{
	"LoadingTips": 
		[
			{
				"LoadingTipId": "Loading-Tip1",
				"GreaterThan": false,
				"LessThan": true,
				"LevelNummer": 35,
				"PreformatingID": "ArenaUnlockLevel"
			},
			{
				"LoadingTipId": "Loading-Tip2",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip3",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 50,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip4",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip5",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 4,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip6",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 2,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip7",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 36,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip8",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 5,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip9",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 44,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip10",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip11",
				"GreaterThan": false,
				"LessThan": true,
				"LevelNummer": 16,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip12",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 11,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip13",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip14",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Loading-Tip15",
				"GreaterThan": false,
				"LessThan": false,
				"LevelNummer": 0,
				"PreformatingID": "CardLevelHint"
			},
			{
				"LoadingTipId": "Loading-Tip16",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 18,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Daily-Pro-Challenge-Advisor-Tip1",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 18,
				"PreformatingID": "None"
			},
			{
				"LoadingTipId": "Daily-Pro-Challenge-Advisor-Tip2",
				"GreaterThan": true,
				"LessThan": false,
				"LevelNummer": 18,
				"PreformatingID": "None"
			}
		]
}
`,
    "VersionInformation.txt": `
{
	"LatestVersion": "2.9.0",
	"ScheduledReleaseDates": 
		[
			{
				"Date": "2000-01-01T00:00",
				"NewTotalNumExistingLevels": 760,
				"NewHighestCardLevel": 16
			},
			{
				"Date": "2016-09-22T13:00",
				"NewTotalNumExistingLevels": 780,
				"NewHighestCardLevel": 17
			},
			{
				"Date": "2016-10-06T13:00",
				"NewTotalNumExistingLevels": 800,
				"NewHighestCardLevel": 18
			},
			{
				"Date": "2016-10-20T13:00",
				"NewTotalNumExistingLevels": 820,
				"NewHighestCardLevel": 19
			}
		]
}
`
  };

  var match = function (url) {
    if (typeof url !== "string" || url.indexOf("StreamingAssets") === -1) return null;
    for (var name in DATA) {
      if (url.indexOf(name) !== -1) return name;
    }
    return null;
  };

  var mimeFor = function (name) {
    return name.slice(-5) === ".json" ? "application/json" : "text/plain";
  };

  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url);
    var name = match(url);
    if (name) {
      var body = DATA[name];
      return Promise.resolve(new Response(body, {
        status: 200,
        headers: { "Content-Type": mimeFor(name), "Content-Length": String(body.length) }
      }));
    }
    return origFetch.apply(this, arguments);
  };

  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__fixName = match(url);
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    var xhr = this;
    if (!xhr.__fixName) return origSend.apply(this, arguments);

    var name = xhr.__fixName;
    var body = DATA[name];

    Object.defineProperty(xhr, "readyState", { configurable: true, get: function () { return 4; } });
    Object.defineProperty(xhr, "status", { configurable: true, get: function () { return 200; } });
    Object.defineProperty(xhr, "statusText", { configurable: true, get: function () { return "OK"; } });
    Object.defineProperty(xhr, "responseText", { configurable: true, get: function () { return body; } });
    Object.defineProperty(xhr, "response", { configurable: true, get: function () {
      if (xhr.responseType === "arraybuffer") {
        return new TextEncoder().encode(body).buffer;
      }
      if (xhr.responseType === "json") {
        try { return JSON.parse(body); } catch (e) { return null; }
      }
      return body;
    }});

    xhr.getAllResponseHeaders = function () { return "content-type: " + mimeFor(name) + "\r\n"; };
    xhr.getResponseHeader = function (h) {
      return h.toLowerCase() === "content-type" ? mimeFor(name) : null;
    };

    setTimeout(function () {
      if (typeof xhr.onreadystatechange === "function") xhr.onreadystatechange();
      xhr.dispatchEvent(new Event("readystatechange"));
      xhr.dispatchEvent(new ProgressEvent("load"));
      xhr.dispatchEvent(new ProgressEvent("loadend"));
      if (typeof xhr.onload === "function") xhr.onload();
    }, 0);
  };
})();
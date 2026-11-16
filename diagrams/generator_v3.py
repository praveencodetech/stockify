import base64
import zlib
import urllib.request

def encode_diagram(text):
    compressed = zlib.compress(text.encode('utf-8'), 9)
    return base64.urlsafe_b64encode(compressed).decode('ascii')

def generate_diagram(text, type, filename):
    encoded = encode_diagram(text)
    url = f"https://kroki.io/{type}/png/{encoded}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

diagrams = [
    {
        "filename": "2_DFD_Context_Level0_Perfect.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 22
skinparam backgroundColor white
skinparam nodesep 120
skinparam ranksep 120
skinparam ArrowColor #000080

rectangle "User (Investor)" as User
rectangle "Market Data API" as MarketAPI
rectangle "Google Gemini API" as GeminiAPI

usecase "0.0\\nStock Analysis\\nPlatform" as System

User -right-> System : " Search, Prompts, Trade Data "
System -left-> User : " Dashboard, AI Insights "

System -down-> MarketAPI : " Stock ticker requests "
MarketAPI -up-> System : " Real-time price & metrics "

System -up-> GeminiAPI : " Formatted prompt context "
GeminiAPI -down-> System : " Natural language analysis "
@enduml"""
    },
    {
        "filename": "2_DFD_Level1_Perfect.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 20
skinparam backgroundColor white
skinparam nodesep 100
skinparam ranksep 120
skinparam ArrowColor #000080

rectangle "User" as User
rectangle "Market Data API" as MarketAPI
rectangle "Google Gemini API" as GeminiAPI

usecase "1.0\\nManage\\nAuthentication" as P1
usecase "2.0\\nFetch\\nStock Data" as P2
usecase "3.0\\nManage\\nPortfolio" as P3
usecase "4.0\\nGenerate\\nAI Insights" as P4

database "D1: Users" as D1
database "D2: Portfolios" as D2
database "D3: Stock Metrics" as D3

User -down-> P1 : "Login Credentials"
P1 -down-> D1 : "Verify/Store User"

User -down-> P2 : "Search Ticker"
P2 -right-> MarketAPI : "API Request"
MarketAPI -left-> P2 : "Stock Data JSON"
P2 -down-> D3 : "Store Metrics"

User -down-> P3 : "Add/Remove Stock"
P3 -down-> D2 : "Update Holdings"

User -down-> P4 : "Ask Question"
P4 -up-> D3 : "Fetch Context"
P4 -right-> GeminiAPI : "Send Prompt"
GeminiAPI -left-> P4 : "AI Response"
@enduml"""
    },
    {
        "filename": "3_Entity_Relationship_Perfect.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 20
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 100
skinparam ranksep 120

entity "User" as user {
  * id : INT <<PK>>
  --
  * username : VARCHAR
  * email : VARCHAR
  * password : VARCHAR
  created_at : TIMESTAMP
}

entity "Stock" as stock {
  * symbol : VARCHAR <<PK>>
  --
  * company_name : VARCHAR
  * sector : VARCHAR
  exchange : VARCHAR
}

entity "StockMetrics" as metrics {
  * id : INT <<PK>>
  --
  * stock_symbol : VARCHAR <<FK>>
  current_price : DECIMAL
  pe_ratio : DECIMAL
  market_cap : DECIMAL
  updated_at : TIMESTAMP
}

entity "Portfolio" as portfolio {
  * id : INT <<PK>>
  --
  * user_id : INT <<FK>>
  * stock_symbol : VARCHAR <<FK>>
  quantity : INT
  purchase_price : DECIMAL
}

entity "Watchlist" as watchlist {
  * id : INT <<PK>>
  --
  * user_id : INT <<FK>>
  * stock_symbol : VARCHAR <<FK>>
}

user ||--o{ portfolio : "manages"
user ||--o{ watchlist : "maintains"
stock ||--o{ portfolio : "included in"
stock ||--o{ watchlist : "tracked in"
stock ||--o{ metrics : "has metrics"

@enduml"""
    }
]

for diag in diagrams:
    generate_diagram(diag["text"], diag["type"], diag["filename"])

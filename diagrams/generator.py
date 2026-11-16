import base64
import zlib
import urllib.request
import os

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
        "filename": "1_System_Architecture.png",
        "type": "plantuml",
        "text": """@startuml
skinparam componentStyle uml2
skinparam backgroundColor white
skinparam DefaultFontName Arial
skinparam dpi 300

package "Frontend (React JS)" {
  [Web Interface]
  [Dashboard]
}

package "Backend (Spring Boot)" {
  [Auth Service]
  [Portfolio Service]
  [Stock Data Service]
}

package "AI Service (Flask)" {
  [NLP Processor]
  [Gemini Model Integration]
}

database "MySQL Database" {
  [User Data]
  [Portfolio Data]
  [Stock Metrics]
}

cloud "External APIs" {
  [Market Data API]
  [Google Gemini API]
}

[Web Interface] <--> [Auth Service] : REST API
[Dashboard] <--> [Stock Data Service] : REST API
[Dashboard] <--> [Portfolio Service] : REST API
[Dashboard] <--> [NLP Processor] : REST API (Chatbot)

[Auth Service] --> [User Data]
[Portfolio Service] --> [Portfolio Data]
[Stock Data Service] --> [Stock Metrics]

[Stock Data Service] --> [Market Data API] : Fetch real-time data
[NLP Processor] --> [Google Gemini API] : AI inference
@enduml"""
    },
    {
        "filename": "2_DFD_Context_Level0.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff' }}}%%
graph LR
    User([User]) -- "Login Credentials, Queries, Trade Orders" --> System((Stock Analysis<br/>Platform))
    System -- "Stock Data, AI Insights, Portfolio Status" --> User
    System -- "Request Market Data" --> API([Market Data API])
    API -- "Real-time Prices, Financials" --> System
    System -- "Prompts" --> Gemini([Google Gemini API])
    Gemini -- "AI Responses, Analysis" --> System"""
    },
    {
        "filename": "2_DFD_Level1.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff' }}}%%
graph TD
    User([User])
    Auth((1.0<br/>Authentication))
    Stock((2.0<br/>Stock Data<br/>Management))
    Portfolio((3.0<br/>Portfolio<br/>Management))
    AI((4.0<br/>AI Chatbot<br/>Service))
    DB[(MySQL Database)]
    MarketAPI([Market Data API])
    GeminiAPI([Gemini API])

    User -- "Login/Register" --> Auth
    Auth -- "Auth Token" --> User
    Auth -- "Store/Verify User" --> DB

    User -- "Search Stock, View Sector" --> Stock
    Stock -- "Stock Details, Metrics" --> User
    Stock -- "Fetch Data" --> MarketAPI
    MarketAPI -- "Live Data" --> Stock
    Stock -- "Store History" --> DB

    User -- "Add/Remove Stocks" --> Portfolio
    Portfolio -- "Portfolio Summary" --> User
    Portfolio -- "Update Portfolio" --> DB

    User -- "Ask Queries" --> AI
    AI -- "Responses, Sentiment" --> User
    AI -- "Fetch Context" --> DB
    AI -- "Send Prompt" --> GeminiAPI
    GeminiAPI -- "NLP Analysis" --> AI"""
    },
    {
        "filename": "3_Entity_Relationship.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff' }}}%%
erDiagram
    USER ||--o{ PORTFOLIO : manages
    USER ||--o{ WATCHLIST : has
    USER {
        int id PK
        string username
        string email
        string password
    }
    STOCK ||--o{ STOCK_METRICS : contains
    STOCK ||--o{ STOCK_HISTORY : has
    STOCK {
        string symbol PK
        string company_name
        string sector
        string exchange
    }
    STOCK_METRICS {
        int id PK
        string stock_symbol FK
        float current_price
        float pe_ratio
        float market_cap
    }
    STOCK_HISTORY {
        int id PK
        string stock_symbol FK
        date date
        float close_price
        float volume
    }
    PORTFOLIO {
        int id PK
        int user_id FK
        string stock_symbol FK
        int quantity
        float purchase_price
    }
    WATCHLIST {
        int id PK
        int user_id FK
        string stock_symbol FK
    }"""
    },
    {
        "filename": "4_Use_Case.png",
        "type": "plantuml",
        "text": """@startuml
left to right direction
skinparam packageStyle rectangle
skinparam backgroundColor white
skinparam DefaultFontName Arial
skinparam dpi 300

actor User

rectangle "Stock Analysis Platform" {
  usecase "Register & Login" as UC1
  usecase "View Dashboard" as UC2
  usecase "Analyze Stock by Sector" as UC3
  usecase "Ask AI Chatbot" as UC4
  usecase "Manage Portfolio" as UC5
  usecase "Add to Watchlist" as UC6
  usecase "Calculate SIP" as UC7
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
@enduml"""
    },
    {
        "filename": "5_Sequence.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff' }}}%%
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant Backend as Spring Boot API
    participant AI as Flask AI Service
    participant DB as MySQL DB
    participant Gemini as Gemini API

    User->>Frontend: Ask stock query "Is Tata Motors good?"
    Frontend->>Backend: POST /api/chat {query}
    Backend->>AI: Forward query
    AI->>DB: Fetch Tata Motors context
    DB-->>AI: Return stock data
    AI->>Gemini: Generate prompt with data
    Gemini-->>AI: Return AI response
    AI-->>Backend: Processed response
    Backend-->>Frontend: Chatbot response
    Frontend-->>User: Display answer on UI"""
    },
    {
        "filename": "6_Methodology.png",
        "type": "mermaid",
        "text": """%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff' }}}%%
graph TD
    A[Requirement Gathering & Planning] --> B[UI/UX Design for React Frontend]
    B --> C[Database Schema Design in MySQL]
    C --> D[Backend API Development with Spring Boot]
    D --> E[Integrate Market Data APIs]
    E --> F[Develop Flask AI Service]
    F --> G[Integrate Google Gemini API]
    G --> H[Connect Frontend to Backend Services]
    H --> I[System Testing & Debugging]
    I --> J[Deployment & Final Delivery]

    classDef stage fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class A,B,C,D,E,F,G,H,I,J stage;"""
    }
]

for diag in diagrams:
    generate_diagram(diag["text"], diag["type"], diag["filename"])

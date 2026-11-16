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
        "filename": "1_System_Architecture_HQ.png",
        "type": "plantuml",
        "text": """@startuml
skinparam dpi 300
skinparam defaultFontSize 24
skinparam backgroundColor white
skinparam nodesep 100
skinparam ranksep 120
skinparam ArrowColor #000080
skinparam defaultFontColor #000000

component "Frontend (React JS)" as Frontend
component "Backend API (Spring Boot)" as Backend
component "AI Microservice (Flask)" as AI
database "MySQL Database" as DB

Frontend -down-> Backend : API Request
Backend -down-> DB : Data Flow
Backend -right-> AI : Query
AI -up-> Backend : Response

@enduml"""
    }
]

for diag in diagrams:
    generate_diagram(diag["text"], diag["type"], diag["filename"])

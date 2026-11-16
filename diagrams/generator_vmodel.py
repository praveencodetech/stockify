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

diagram_text = """@startuml
skinparam dpi 300
skinparam defaultFontSize 24
skinparam backgroundColor white
skinparam nodesep 120
skinparam ranksep 120
skinparam ArrowColor #000080
skinparam RectangleBorderColor #000080
skinparam RectangleBackgroundColor #F8F8F8

title V-Model of Software Testing\\n(Verification on Left, Validation on Right)

rectangle "Requirements" as req
rectangle "System Design" as sysd
rectangle "High-Level Design" as hld
rectangle "Low-Level Design" as lld

rectangle "Unit Testing" as unit

rectangle "Integration Testing" as intt
rectangle "System Testing" as syst
rectangle "User Acceptance\\nTesting (UAT)" as uat

req -down-> sysd : " "
sysd -down-> hld : " "
hld -down-> lld : " "
lld -down-> unit : " "

unit -up-> intt : " "
intt -up-> syst : " "
syst -up-> uat : " "

req .right.> uat : " Requirements Validation "
sysd .right.> syst : " System Validation "
hld .right.> intt : " Integration Validation "
@enduml"""

generate_diagram(diagram_text, "plantuml", "8_V_Model_Testing_HQ.png")

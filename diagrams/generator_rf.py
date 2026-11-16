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
skinparam defaultFontSize 22
skinparam backgroundColor white
skinparam nodesep 80
skinparam ranksep 100
skinparam ArrowColor #000080

rectangle "Stock Market Dataset\\n(Features: PE Ratio, Volume, Sentiment)" as Dataset

rectangle "Bootstrap Sample 1" as S1
rectangle "Bootstrap Sample 2" as S2
rectangle "Bootstrap Sample N" as SN

usecase "Decision Tree 1" as T1
usecase "Decision Tree 2" as T2
usecase "Decision Tree N" as TN

rectangle "Prediction: Buy" as P1
rectangle "Prediction: Sell" as P2
rectangle "Prediction: Buy" as PN

hexagon "Majority Vote\\nAggregation" as Vote

rectangle "Final Output: BUY" as Final

Dataset -down-> S1 : " Data Splitting "
Dataset -down-> S2
Dataset -down-> SN

S1 -down-> T1
S2 -down-> T2
SN -down-> TN

T1 -down-> P1
T2 -down-> P2
TN -down-> PN

P1 -down-> Vote
P2 -down-> Vote
PN -down-> Vote

Vote -down-> Final
@enduml"""

generate_diagram(diagram_text, "plantuml", "7_Random_Forest_Logic_HQ.png")

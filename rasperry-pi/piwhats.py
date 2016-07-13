import paho.mqtt.client as paho
import os
import socket
import ssl
import json
import subprocess

def send(msg):
    print("topic: "+msg.topic)
    print("payload: "+str(msg.payload))
    print("IMPOOOOO+"+json.loads(bytearray(msg.payload).decode('latin-1'))['state']['desired']['Recepient']+msg.topic)
    if json.loads(bytearray(msg.payload).decode('latin-1'))['state']['desired']['Recepient'].lower()=='micheal': #ADD YOUR CONTACTS HERE WITH IF ELSE IF AND CHANGE PHONE NUMBER AND NAME
         print("COOOOOOOOOOOOOOOOOOOOOOOL"+json.loads(bytearray(msg.payload).decode('latin-1'))['state']['desired']['Recepient'])
         subprocess.call(['yowsup-cli','demos –config yowsup/whatsapp_config.txt –send 5219999999999 '++json.loads(bytearray(msg.payload).decode('latin-1'))['state']['desired']['Message'])],shell=True)
         pass	

def on_connect(client, userdata, flags, rc):
    print("Connection returned result: " + str(rc) )
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$aws/things/PiGroundStation01/shadow/update/accepted" , 1 )
    print("subscribed to topic")

def on_message(client, userdata, msg):
    send(msg)


mqttc = paho.Client()
mqttc.on_connect = on_connect
mqttc.on_message = on_message


awshost = "a4hxjcrdpeqvc.iot.us-east-1.amazonaws.com"
awsport = 8883
clientId = "myThingName"
thingName = "PiGroundStation01"
caPath = "ca.pem"
certPath = "77b84ee3fa-certificate.pem.crt"
keyPath = "77b84ee3fa-private.pem.key"

mqttc.tls_set(caPath, certfile=certPath, keyfile=keyPath, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)

mqttc.connect(awshost, awsport, keepalive=60)

mqttc.loop_forever()

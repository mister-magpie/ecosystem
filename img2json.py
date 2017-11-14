import os
import sys
from PIL import Image
import json

if __name__ == '__main__':
    print "converting 100x100 map image to json array"
    imgpath = sys.argv[1]
    jsonpath = sys.argv[2]
    im = Image.open(imgpath)
    assert im.size == (100,100)
    print "loading " + imgpath
    p = im.load()
    result = []
    for i in range(10000):
        r,g,b = p[i/100,i%100]
        if(r==0 and g==0 and b==255):
            result.append("sea")
        elif(r==0 and g==255 and b==0):
            result.append("grass")
        elif(r==255 and g==255 and b==0):
            result.append("sand")
        elif(r==255 and g==0 and b==255):
            result.append("marsh")
        elif(r==0 and g==0 and b==0):
            result.append("urban")
    print "dumping " + jsonpath
    with open(jsonpath, 'wb') as target:
        json.dump(result,target)

f = open("meanOutput.txt", "r");

lastX = 0
lastY = 0
lastGradient = 0.00

outArr = []

for line in f:
    splitArr = line.split(",")
    x = int(splitArr[0][1:])
    y = int(splitArr[1][:-1])
    
    if (x == lastX and y == lastY):
        continue;

    if (float(x) - float(lastX) != 0):
        gradient = float(float(y) - float(lastY)) / (float(x) - float(lastX))

    # if (gradient == lastGradient):
        # continue;

    print("X: ", x, " Y: ", y, " Gradient: ", gradient)
    lastX = x;
    lastY = y;
    lastGradient = gradient
    outArr.append("[\n\t" + str(x) + ",\n\t" + str(y) + "\n],\n")

w = open("optimiseOutput.txt", "w");
for out in outArr:
    w.write(out);
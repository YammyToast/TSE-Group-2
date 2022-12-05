f = open("./input.txt", "r");

xMean = 0;
yMean = 0;
count = 0;
splitArr = []

print("[✓] Starting")

for line in f:
    lineSplit = line.split("\n")[0].split(",")
    xMean += int(lineSplit[0])
    yMean += int(lineSplit[1])
    count += 1
    splitArr.append(lineSplit);

xMean = int(xMean / count)
yMean = int(yMean / count)
print("xMean: " + str(xMean) + " yMean: " + str(yMean));

w = open("./output.txt", "w");
for line in splitArr:
    w.write("[" + str(int(line[0]) - xMean) + "," + str(int(line[1]) - yMean) + "],");
print("[✓] Done")
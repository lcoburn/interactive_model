import matplotlib.pyplot as plt

# p1 = [ -16.314964443328712, -3 ]
# p2 = [ -8.188699722290039, -3 ]
# p3 = [ -8.188699722290039, 3.274899959564209 ]
# p4 = [ -16.314964443328712, 3.274899959564209 ]

# plt.plot([p1[0], p2[0]], [p1[1], p2[1]], color='k')
# plt.plot([p3[0], p2[0]], [p3[1], p2[1]], color='k')
# plt.plot([p3[0], p4[0]], [p3[1], p4[1]], color='k')
# plt.plot([p1[0], p4[0]], [p1[1], p4[1]], color='k')

# x = [5.2586,10.5523,10.5576,10.5258,10.5152,10.5118,10.4375,10.4145,
# 4.7488,3.6676,0.8109,-0.2279,-0.1183,-0.1007,0,-0.0318,3.6994]
# for i in range(len(x)):
#     x[i] = -1*x[i] - 2.89

# y = [-4.0768,-4.0598,0.0053,6.2752,8.5224,9.1849,24.9943,29.8707,30.0509,
# 28.1323,28.0899,29.9184,9.5126,6.254,0,-4.1075,-4.081]
# plt.plot(x, y, 'r-')

# plt.show()
from mpl_toolkits.mplot3d import Axes3D

pts = [-3.152600049972534,3,4.05620002746582,-3,3,-3,-5.826900005340576,5.800000190734863,
0.4433000087738037,-3.0762999057769775,5.800000190734863,0.5281000137329102,-3,0,-3,3,0,-3,3,
0,3,-3, 0,3]

x = []
y = []
z = []
for i in range(int(len(pts)/3)):
    x.append(pts[3*i])
    z.append(pts[3*i+1])
    y.append(pts[3*i+2])

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.scatter(x, y, z, c='r', marker='o')
ax.set_xlabel('X Label')
ax.set_ylabel('Y Label')
ax.set_zlabel('Z Label')
ax.set_title('3D Scatter Plot')
plt.show()



 
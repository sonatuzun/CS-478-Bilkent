import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import axes3d
from mpl_toolkits.mplot3d.art3d import Poly3DCollection 
from matplotlib import style


plt.ion()

plt.figure('spltv',figsize=(20,10))
custom = plt.subplot(121,projection='3d')


#print( x_points := 15 + np.random.random(1) )

point1 = np.array([1, 5, 0])
point2 = np.array([-2, 3, 0])
point3 = np.array([0, 0, 6])
point4 = np.array([4, 0, 0])

for p in [point1, point2, point3, point4]:
    custom.scatter(p[0],p[1],p[2])

def add_triangle( p1, p2, p3 ):
    x1=np.array([p1[0], p2[0], p3[0]])
    y1=np.array([p1[1], p2[1], p3[1]])
    z1=np.array([p1[2], p2[2], p3[2]])
    
    v1 = p2 - p1
    v2 = p3 - p1
    normal = np.cross(v1, v2)
    normal = normal / np.linalg.norm( normal )
    light_direction = np.array( [1, 1, 1] )
    light_direction = light_direction / np.linalg.norm( light_direction )
    shade = np.dot( normal, light_direction )
    
    
    # 1. create vertices from points
    verts = [list(zip(x1, y1, z1))]
    # 2. create 3d polygons and specify parameters
    srf = Poly3DCollection(verts, alpha=1.0, facecolor=(shade,shade,shade) )
    # 3. add polygon to the figure (current axes)
    plt.gca().add_collection3d(srf)


    


custom.set_xlabel('x')
custom.set_ylabel('y')
custom.set_zlabel('z')




plt.pause(0.2)
add_triangle( point1, point2, point3 );
plt.pause(0.2)
add_triangle( point2, point3, point4 );
plt.pause(0.2)
add_triangle( point3, point4, point1 );
plt.pause(0.2)
add_triangle( point4, point1, point2 );
plt.pause(100.0)
# plt.clf() #clear the current figure.
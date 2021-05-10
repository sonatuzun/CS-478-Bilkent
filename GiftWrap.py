from mpl_toolkits import mplot3d
import numpy as np
import matplotlib.pyplot as plt
import sys
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import axes3d
from mpl_toolkits.mplot3d.art3d import Poly3DCollection 
from matplotlib import style

class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
    
    def to_vector(self):
        return np.array([self.x, self.y, self.z])
    
    def __str__(self):
        return "[Point: x=" + str(self.x) + " y=" + str(self.y) + " z=" + str(self.z) + "]"

    def __eq__(self, o):
        return self.x == o.x and self.y == o.y and self.z == o.z
    def __hash__(self):
        return hash(str(self))


class Edge:
    def __init__(self, points):
        self.points = points
    def to_vector(self):
        return np.abs( np.subtract(self.points[0].to_vector(), self.points[1].to_vector()) )

    def __str__(self):
        return "(Edge: " + str(self.points[0]) + ", " + str(self.points[1]) + ")"

    def __eq__(self, o):
        res = ( self.points[0] == o.points[0] and self.points[1] == o.points[1] ) or ( self.points[0] == o.points[1] and self.points[1] == o.points[0] )
        return res
    def __hash__(self):
        return hash(str(self))

class Face:
    def __init__(self, vertices):
        self.vertices = vertices
        edge1 = Edge( [self.vertices[0], self.vertices[1] ])
        edge2 = Edge( [self.vertices[1], self.vertices[2] ])
        edge3 = Edge( [self.vertices[2], self.vertices[0] ])
        self.edges = [ edge1, edge2, edge3 ]
        
    def get_unit_vector(self):
        x = self.edges[0].to_vector()
        y = self.edges[1].to_vector()
        cross = np.cross(x, y)
        return cross / len(cross)

    def __str__(self):
        return "{Face: " + self.vertices[0].__str__() + ", " + self.vertices[1].__str__() + ", " + self.vertices[2].__str__() + "}"


def intersection(lst1, lst2):
    return list(set(lst1) & set(lst2))

def union(lst1, lst2):
    return list(set(lst1) | set(lst2))

def of_face(point, face):
    for v in face.vertices:
        if point.__eq__(v):
            return True
        return False

def find_next_point(S, e, f):
    n = f.get_unit_vector()
    a_cross = np.cross( n, e.to_vector() )
    a = a_cross / len(a_cross)
    g_min = sys.float_info.max
    for pk in S:
        if of_face(pk, f) == False:
            g = np.dot(a, Edge([e.points[0], pk]).to_vector() )
            if(g < g_min):
                g_min = g
                result = pk
    return result


def gift_wrap(S):
    print("GIFT WRAAP")
    RES = set()
    Q = set()   
    G = set()
    F = Face( [Point(0,0,0), Point(0,5,0), Point(2,2,0)] ) #initial_facet(S)
    G = set(F.edges)
    Q.add(F)
    while 0 != len(Q):
        print("inside while len: ", len(Q))
        F = Q.pop()
        print("inside while len: ", len(Q))
        T = set(F.edges)
        print("end1")
        for e in T.intersection(G): 
            print("inside for")
            pk = find_next_point(S, e, F)
            F_prime = Face( [e.points[0], e.points[1], pk] )
            B = set(F_prime.edges)
            G = G ^ B
            Q.add(F_prime)
        RES.add(F)
            
    return RES

S = [Point(0,0,0), Point(0,5,0), Point(2,2,0), Point(1,1,3) ]
F = gift_wrap(S)

for f in F:
    print(f)

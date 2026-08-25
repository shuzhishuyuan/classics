"""Generate a web-friendly, parameterized Yuelu Academy blockout.

Run with Blender in background mode:
  blender --background --python generate_yuelu.py
The script intentionally keeps named collections and hotspot empties.
"""
import bpy
import os
import math
from mathutils import Vector

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_BLEND = os.path.join(ROOT, "yuelu_academy_preview.blend")
OUT_GLB = os.path.join(ROOT, "yuelu_academy_preview.glb")

def material(name, color, roughness=0.7, metallic=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1.0)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return m

WOOD = material("Yuelu_Wood", (0.22, 0.075, 0.035))
ROOF = material("Yuelu_Roof_Tile", (0.12, 0.14, 0.15))
WALL = material("Yuelu_Lime_Wall", (0.72, 0.68, 0.56))
STONE = material("Yuelu_Stone", (0.25, 0.28, 0.25))
GREEN = material("Yuelu_Bamboo", (0.08, 0.22, 0.12))

def cube(name, location, scale, mat, collection):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    collection.objects.link(obj)
    for c in list(obj.users_collection):
        if c != collection: c.objects.unlink(obj)
    return obj

def roof(name, location, width, depth, collection):
    left = cube(name + "_left", (location[0] - width * 0.22, location[1] + 0.38, location[2]), (width * 0.28, 0.16, depth / 2 + 0.35), ROOF, collection)
    right = cube(name + "_right", (location[0] + width * 0.22, location[1] + 0.38, location[2]), (width * 0.28, 0.16, depth / 2 + 0.35), ROOF, collection)
    left.rotation_euler[1] = math.radians(-16)
    right.rotation_euler[1] = math.radians(16)
    cube(name + "_ridge", (location[0], location[1] + 0.82, location[2]), (0.18, 0.13, depth / 2 + 0.45), ROOF, collection)
    return left

def building(name, location, width, depth, collection):
    cube(name + "_walls", (location[0], 1.5, location[2]), (width / 2, 1.5, depth / 2), WALL, collection)
    for i in range(7):
        x = -width / 2 + 0.45 + i * (width - 0.9) / 6
        cube(name + "_front_pillar_" + str(i), (location[0] + x, 1.6, location[2] - depth / 2 - 0.3), (0.16, 1.6, 0.16), WOOD, collection)
        cube(name + "_back_pillar_" + str(i), (location[0] + x, 1.6, location[2] + depth / 2 + 0.3), (0.16, 1.6, 0.16), WOOD, collection)
    cube(name + "_front_beam", (location[0], 3.1, location[2] - depth / 2 - 0.3), (width / 2 + 0.4, 0.16, 0.16), WOOD, collection)
    roof(name + "_roof", (location[0], 3.1, location[2]), width + 0.8, depth + 0.8, collection)

def empty(name, location, collection):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = 'SPHERE'
    obj.empty_display_size = 0.45
    obj.location = location
    collection.objects.link(obj)
    return obj

def main():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.collections):
        if c.name != "Collection": bpy.data.collections.remove(c)
    root = bpy.data.collections.new("YueluAcademy")
    bpy.context.scene.collection.children.link(root)
    collections = {n: bpy.data.collections.new(n) for n in ["Terrain", "Architecture", "Environment", "Culture", "Hotspots"]}
    for c in collections.values(): root.children.link(c)
    bpy.ops.mesh.primitive_plane_add(size=48, location=(0, -0.02, 0))
    ground = bpy.context.object
    ground.name = "academy_ground"
    ground.data.materials.append(STONE)
    collections["Terrain"].objects.link(ground)
    cube("academy_path", (0, 0.02, 5), (2.2, 0.04, 18), WALL, collections["Terrain"])
    cube("academy_stream", (8, -0.02, 2), (1.2, 0.03, 20), material("Yuelu_Water", (0.08, 0.24, 0.27), 0.18), collections["Terrain"])
    for z in range(-12, 17, 2):
        cube("stone_step_" + str(z), (0, 0.08, z), (1.05, 0.08, 0.36), STONE, collections["Terrain"])
    building("academy_gate", (0, 0, -10), 8, 2.2, collections["Architecture"])
    building("lecture_hall", (0, 0, -2), 12, 5, collections["Architecture"])
    building("imperial_library", (0, 0, 7), 9, 5, collections["Architecture"])
    for x in (-10, -7, 7, 10):
        for z in (-8, -2, 5, 12):
            cube("bamboo_%s_%s" % (x, z), (x, 2, z), (0.18, 2, 0.18), GREEN, collections["Environment"])
    for x, z in [(-13, -9), (13, -6), (-12, 6), (12, 14)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.35, depth=5, location=(x, 2.5, z))
        trunk = bpy.context.object
        trunk.name = "ancient_tree_trunk_%s_%s" % (x, z)
        trunk.data.materials.append(WOOD)
        collections["Environment"].objects.link(trunk)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=2.2, location=(x, 6, z))
        crown = bpy.context.object
        crown.name = "ancient_tree_crown_%s_%s" % (x, z)
        crown.scale = (1.2, 0.8, 1.1)
        crown.data.materials.append(GREEN)
        collections["Environment"].objects.link(crown)
    empty("avatar_spawn", (0, 2.2, 16), collections["Hotspots"])
    empty("hotspot_gate", (0, 2.5, -9), collections["Hotspots"])
    empty("hotspot_lecture_hall", (0, 2.5, -2), collections["Hotspots"])
    empty("hotspot_imperial_library", (0, 2.5, 7), collections["Hotspots"])
    empty("hotspot_stele_gallery", (7, 1.5, 0), collections["Hotspots"])
    bpy.ops.object.camera_add(location=(0, 4.4, 22))
    bpy.context.object.name = "academy_camera"
    bpy.context.scene.camera = bpy.context.object
    bpy.ops.object.light_add(type='AREA', location=(0, 12, 4))
    bpy.context.object.name = "academy_key_light"
    bpy.context.object.data.energy = 1800
    bpy.context.object.data.shape = 'DISK'
    bpy.context.object.data.size = 12
    bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
    bpy.ops.export_scene.gltf(filepath=OUT_GLB, export_format='GLB', export_apply=True, export_texcoords=True, export_normals=True, export_materials='EXPORT')
    print("Generated", OUT_BLEND, OUT_GLB)

if __name__ == "__main__":
    main()

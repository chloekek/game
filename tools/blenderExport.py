import bpy
import os

output_path = os.environ["OUTPUT"]

def deselect_all():
    """Deselect all objects."""
    for obj in bpy.data.objects:
        obj.select = False

def select_recursively(object):
    object.select = True
    for obj in object.children:
        select_recursively(obj)

def scene_level_objects():
    """Find all scene-level objects."""
    return (obj for obj in bpy.context.scene.objects
                if obj.parent is None)

for obj in scene_level_objects():
    # Select only this object.
    deselect_all()
    select_recursively(obj)

    # Reposition the object at the origin.
    obj.location.x = 0
    obj.location.y = 0
    obj.location.z = 0

    # Export the object as Wavefront OBJ with material.
    bpy.ops.export_scene.obj(
        filepath=output_path + "/" + obj.name + ".obj",
        path_mode="RELATIVE",
        use_selection=True,
    )

"""Hair cards: a strand texture drawn here and the curved strips that carry it.

Not a build step (only NN_*.py files run); 47_hair_cards.py imports it. A hair card is a
thin strip rooted on the head with a texture of strands whose gaps are cut out (glTF alpha
MASK), the way games make hair read as hair. Everything here is made from numbers, no
outside images.
"""
import bpy
import numpy as np


def strand_texture(name, width=256, height=512, strands=110, seed=3):
    """White strands on a transparent card, roots at the bottom (v 0), tips at the top.

    Each strand tapers to its tip and bends a little; RGB darkens toward the root so a
    clump has depth. Alpha fades at the card's sides so no card shows a hard edge.
    """
    rng = np.random.default_rng(seed)
    alpha = np.zeros((height, width), np.float32)
    shade = np.zeros((height, width), np.float32)
    xs = np.arange(width, dtype=np.float32)
    for _ in range(strands):
        x0 = rng.uniform(0.06, 0.94) * width
        rows = int(rng.uniform(0.55, 1.0) * (height - 1))
        bend = rng.uniform(-0.15, 0.15) * width
        w0 = rng.uniform(1.4, 3.0)
        tone = rng.uniform(0.75, 1.0)
        for r in range(rows + 1):
            t = r / rows
            xc = x0 + bend * t * t
            cover = np.clip(w0 * (1.0 - 0.85 * t) / 2 + 0.5 - np.abs(xs - xc), 0.0, 1.0)
            row_a = alpha[r]
            newer = cover > row_a
            shade[r] = np.where(newer, tone * (0.65 + 0.35 * t), shade[r])
            np.maximum(row_a, cover, out=row_a)
    side = np.clip(np.minimum(xs, width - 1 - xs) / (0.08 * width), 0.0, 1.0)
    alpha *= side[None, :]
    pixels = np.stack([shade, shade, shade, alpha], axis=-1)
    image = bpy.data.images.new(name, width, height, alpha=True)
    image.pixels.foreach_set(pixels.ravel())
    image.file_format = "PNG"
    image.pack()
    return image


def card_material(name, image, rgb, roughness=0.6):
    """Texture times a colour for the base colour, texture alpha rounded for a clean cut
    (the glTF exporter reads Round as alpha MASK at 0.5)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = image
    mix = nodes.new("ShaderNodeMix")
    mix.data_type, mix.blend_type = "RGBA", "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    sockets = {s.identifier: s for s in mix.inputs}
    links.new(tex.outputs["Color"], sockets["A_Color"])
    sockets["B_Color"].default_value = (*rgb, 1.0)
    links.new(next(s for s in mix.outputs if s.identifier == "Result_Color"), bsdf.inputs["Base Color"])
    cut = nodes.new("ShaderNodeMath")
    cut.operation = "ROUND"
    links.new(tex.outputs["Alpha"], cut.inputs[0])
    links.new(cut.outputs["Value"], bsdf.inputs["Alpha"])
    bsdf.inputs["Roughness"].default_value = roughness
    mat.surface_render_method = "DITHERED"
    mat.use_backface_culling = False
    return mat


def card(bm, uv, deform, weights, root, direction, normal, length, width, segments, curl, u_range):
    """A strip from root along direction, bending curl * length toward normal by its tip,
    narrowing to 70 percent at the tip. Returns its faces; vertices take the given weights."""
    side = direction.cross(normal).normalized()
    rows = []
    for i in range(segments + 1):
        t = i / segments
        p = root + direction * (length * t) + normal * (curl * length * t * t)
        half = width * (1.0 - 0.3 * t) / 2
        pair = [bm.verts.new(p - side * half), bm.verts.new(p + side * half)]
        for v in pair:
            for g, w in weights.items():
                v[deform][g] = w
        rows.append((t, pair))
    faces = []
    u0, u1 = u_range
    for (t0, a), (t1, b) in zip(rows, rows[1:]):
        f = bm.faces.new((a[0], a[1], b[1], b[0]))
        for loop, (u, v) in zip(f.loops, ((u0, t0), (u1, t0), (u1, t1), (u0, t1))):
            loop[uv].uv = (u, v)
        faces.append(f)
    return faces


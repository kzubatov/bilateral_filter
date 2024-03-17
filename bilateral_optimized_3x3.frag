#version 450

layout(location = 0) out vec4 color;

layout(binding = 0) uniform sampler2D colorTex;

layout(location = 0) in vec2 texCoord;

layout(push_constant) uniform params_t
{
    vec2 offset;               //  1.0 / vec2(width, height)
    float gaussian_divisor;    // -1.0 / (2.0 * sigma_d * sigma_d)
    float intensities_divisor; // -1.0 / (2.0 * sigma_r * sigma_r) 
} params;

void main()
{
    vec2 t = vec2((ivec2(gl_FragCoord.xy) & 1) * -2 + 1);
    
    vec3 texels[4]; 
    texels[0] = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1) * t, 0).rgb;
    texels[1] = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1) * t, 0).rgb;
    texels[2] = textureLod(colorTex, texCoord + params.offset * vec2(-1,  1) * t, 0).rgb;
    texels[3] = textureLod(colorTex, texCoord + params.offset * vec2( 1,  1) * t, 0).rgb;

    vec3 central = texels[3];
    vec4 color_and_w = vec4(texels[3], 1.0);
    float texel_w;

    color_and_w += dFdxFine(color_and_w) * t.x;
    central = color_and_w.xyz; // += dFdxFine(central) * t.x;

    texel_w = exp(params.gaussian_divisor + dot(texels[2] - central, texels[2] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[2] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[3] - central, texels[3] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[3] * texel_w, texel_w);

    color_and_w += dFdyFine(color_and_w) * t.y;
    central += dFdyFine(central) * t.y;

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[0] - central, texels[0] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[0] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[1] - central, texels[1] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[1] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[2] - central, texels[2] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[2] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[3] - central, texels[3] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[3] * texel_w, texel_w);

    color_and_w += dFdxFine(color_and_w) * t.x;
    central += dFdxFine(central) * t.x;

    texel_w = exp(params.gaussian_divisor + dot(texels[1] - central, texels[1] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[1] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[3] - central, texels[3] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[3] * texel_w, texel_w);

    color_and_w += dFdxFine(color_and_w) * t.x;

    color = color_and_w / color_and_w.w;
}
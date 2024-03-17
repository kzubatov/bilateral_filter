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
    
    vec3 central = texels[3] + dFdxFine(texels[3]) * t.x;
    central += dFdyFine(central) * t.y;

    vec3 sum = central;
    float sum_w = 1.0, texel_w;

    for (int i = 0; i < 4; ++i)
    {
        sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[i] - central, texels[i] - central) * params.intensities_divisor);
        sum += texel_w * texels[i];
    }

    texels[0] = texels[3] + dFdxFine(texels[3]) * t.x;
    texels[3] += dFdyFine(texels[3]) * t.y;
    texels[1] += dFdxFine(texels[1]) * t.x;
    texels[2] += dFdyFine(texels[2]) * t.y;

    for (int i = 0; i < 4; ++i)
    {
        sum_w += texel_w = exp(params.gaussian_divisor + dot(texels[i] - central, texels[i] - central) * params.intensities_divisor);
        sum += texel_w * texels[i];
    }

    color = vec4(sum / sum_w, 1.0);
}
#version 450

#define USE_NINE_REG
//#define USE_ONE_REG

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
    vec2 t = vec2(ivec2(gl_FragCoord.xy) & 1) * -2.0 + 1.0;

    vec3 texels[9];
    texels[0] = textureLod(colorTex, texCoord + params.offset * vec2(-2, -2) * t, 0).rgb;
    texels[1] = textureLod(colorTex, texCoord + params.offset * vec2( 0, -2) * t, 0).rgb;
    texels[2] = textureLod(colorTex, texCoord + params.offset * vec2( 2, -2) * t, 0).rgb;
    texels[3] = textureLod(colorTex, texCoord + params.offset * vec2(-2,  0) * t, 0).rgb;
    texels[4] = textureLod(colorTex, texCoord, 0).rgb;
    texels[5] = textureLod(colorTex, texCoord + params.offset * vec2( 2,  0) * t, 0).rgb;
    texels[6] = textureLod(colorTex, texCoord + params.offset * vec2(-2,  2) * t, 0).rgb;
    texels[7] = textureLod(colorTex, texCoord + params.offset * vec2( 0,  2) * t, 0).rgb;
    texels[8] = textureLod(colorTex, texCoord + params.offset * vec2( 2,  2) * t, 0).rgb;

    vec3 central = texels[4];
    central += dFdxFine(central) * t.x;
    vec4 color_and_w = vec4(0); 
    float texel_w;
    
    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[1] - central, texels[1] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[1] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[2] - central, texels[2] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[2] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[4] - central, texels[4] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[4] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[5] - central, texels[5] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[5] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[7] - central, texels[7] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[7] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[8] - central, texels[8] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[8] * texel_w, texel_w);

    color_and_w += dFdyFine(color_and_w) * t.y;
    central += dFdyFine(central) * t.y;

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[4] - central, texels[4] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[4] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[5] - central, texels[5] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[5] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[7] - central, texels[7] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[7] * texel_w, texel_w);

    texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[8] - central, texels[8] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[8] * texel_w, texel_w);

    color_and_w += dFdxFine(color_and_w) * t.x;
    central += dFdxFine(central) * t.x;

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[3] - central, texels[3] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[3] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[4] - central, texels[4] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[4] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[5] - central, texels[5] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[5] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[6] - central, texels[6] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[6] * texel_w, texel_w);

    texel_w = exp(params.gaussian_divisor + dot(texels[7] - central, texels[7] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[7] * texel_w, texel_w);

    texel_w = exp(5.0 * params.gaussian_divisor + dot(texels[8] - central, texels[8] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[8] * texel_w, texel_w);

    color_and_w += dFdyFine(color_and_w) * t.y;
    central = texels[4];

    texel_w = exp(8.0 * params.gaussian_divisor + dot(texels[0] - central, texels[0] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[0] * texel_w, texel_w);

    texel_w = exp(4.0 * params.gaussian_divisor + dot(texels[1] - central, texels[1] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[1] * texel_w, texel_w);

    texel_w = exp(8.0 * params.gaussian_divisor + dot(texels[2] - central, texels[2] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[2] * texel_w, texel_w);

    texel_w = exp(4.0 * params.gaussian_divisor + dot(texels[3] - central, texels[3] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[3] * texel_w, texel_w);

    color_and_w += vec4(central, 1.0);

    texel_w = exp(4.0 * params.gaussian_divisor + dot(texels[5] - central, texels[5] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[5] * texel_w, texel_w);

    texel_w = exp(8.0 * params.gaussian_divisor + dot(texels[6] - central, texels[6] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[6] * texel_w, texel_w);

    texel_w = exp(4.0 * params.gaussian_divisor + dot(texels[7] - central, texels[7] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[7] * texel_w, texel_w);

    texel_w = exp(8.0 * params.gaussian_divisor + dot(texels[8] - central, texels[8] - central) * params.intensities_divisor);
    color_and_w += vec4(texels[8] * texel_w, texel_w);

    color = vec4(color_and_w.xyz / color_and_w.w, 1.0);
}
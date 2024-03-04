#version 450

layout(location = 0) out vec4 color;

layout(binding = 0) uniform sampler2D colorTex;

layout(location = 0) in vec2 texCoord;

layout(push_constant) uniform params_t
{
    vec2 offset;        //  1.0 / vec2(width, height)
    float gaussian_divisor;    // -1.0 / (2.0 * sigma_d * sigma_d)
    float intensities_divisor; // -1.0 / (2.0 * sigma_r * sigma_r) 
} params;

// #define USE_FOUR_REG
    // #define UNIFORM_READ
    // #define NONUNIFORM_READ
#define USE_ONE_REG /* best on amd apu */

void main()
{
#if defined(USE_FOUR_REG)

#elif defined(USE_ONE_REG)
    vec2 t = vec2(ivec2(gl_FragCoord.xy) & 1) * -2.0 + 1.0;
    
    vec3 texel = textureLod(colorTex, texCoord, 0).rgb;
    vec3 cental = texel;

    vec3 sum = cental;
    float sum_w = 1.0, texel_w;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-2, -2) * t, 0).rgb;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 0, -2) * t, 0).rgb;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 2, -2) * t, 0).rgb;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( -2, 0) * t, 0).rgb;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(  2, 0) * t, 0).rgb;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( -2, 2) * t, 0).rgb;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(  0, 2) * t, 0).rgb;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(  2, 2) * t, 0).rgb;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    color = vec4(sum / sum_w, 1.0);
#endif
}
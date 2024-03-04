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

void main()
{
    vec2 t = vec2(ivec2(gl_FragCoord.xy) & 1) * -2.0 + 1.0;
    
    vec3 texel = textureLod(colorTex, texCoord + t * params.offset, 0).rgb;
    vec3 cental = texel + dFdxFine(texel) * t.x;
    cental += dFdyFine(cental) * t.y;

    vec3 sum = cental;
    float sum_w = 1.0, texel_w;

    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = cental + dFdxFine(cental) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-3, -3) * t, 0).rgb;
    sum_w += texel_w = exp(18.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-1, -3) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 1, -3) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(9.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 3, -3) * t, 0).rgb;
    sum_w += texel_w = exp(18.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-3, -1) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 3, -1) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-3,  1) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(9.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-1,  1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 3,  1) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(9.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-3,  3) * t, 0).rgb;
    sum_w += texel_w = exp(18.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2(-1,  3) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 1,  3) * t, 0).rgb;
    sum_w += texel_w = exp(10.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(9.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(4.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(5.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 3,  3) * t, 0).rgb;
    sum_w += texel_w = exp(18.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(8.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(13.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    color = vec4(sum / sum_w, 1.0);
}
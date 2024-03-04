#version 450
#extension GL_ARB_separate_shader_objects : enable

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
// #define ANOTHER_ONE

void main()
{
#if defined(USE_FOUR_REG)
    ivec2 isOdd = ivec2(gl_FragCoord.xy) & 1;
    vec2 t = vec2(isOdd) * -2.0 + 1.0;
    int id = isOdd.x + isOdd.y * 2;
    
#if defined(NONUNIFORM_READ)
    vec3 texels[4] = 
    {
        textureLod(colorTex, texCoord + params.offset * vec2(-1, -1) * t, 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2( 1, -1) * t, 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2(-1,  1) * t, 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2( 1,  1) * t, 0).rgb,
    };
#elif defined(UNIFORM_READ)
    vec3 texels[4] = 
    {
        textureLod(colorTex, texCoord + params.offset * vec2(-1, -1), 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2( 1, -1), 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2(-1,  1), 0).rgb,
        textureLod(colorTex, texCoord + params.offset * vec2( 1,  1), 0).rgb,
    };
#endif

#if defined(UNIFORM_READ)
    vec3 cental = id == 0 ? texels[3] : 
                  id == 1 ? texels[2] :
                  id == 2 ? texels[1] : texels[0];
#elif defined(NONUNIFORM_READ)
    vec3 cental = texels[3];
#endif
    vec3 tmp = cental += dFdxFine(cental) * t.x;
    cental += dFdyFine(cental) * t.y;

    vec3 sum = cental;
    float sum_w = 1.0, texel_w;

    for (int i = 0; i < 4; ++i)
    {
        sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[i] - cental, texels[i] - cental) * params.intensities_divisor);
        sum += texel_w * texels[i];
    }

    sum_w += texel_w = exp(params.gaussian_divisor + dot(tmp - cental, tmp - cental) * params.intensities_divisor);
    sum += texel_w * tmp;

#if defined(UNIFORM_READ)
    tmp = id == 0 ? texels[3] : 
          id == 1 ? texels[2] :
          id == 2 ? texels[1] : texels[0];
#elif defined(NONUNIFORM_READ)
    tmp = texels[3];
#endif
    tmp += dFdyFine(tmp) * t.y;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(tmp - cental, tmp - cental) * params.intensities_divisor);
    sum += texel_w * tmp;

#if defined(UNIFORM_READ)
    tmp = id == 0 ? texels[1] : 
          id == 1 ? texels[0] :
          id == 2 ? texels[3] : texels[2];
#elif defined(NONUNIFORM_READ)
    tmp = texels[1];
#endif
    tmp += dFdxFine(tmp) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(tmp - cental, tmp - cental) * params.intensities_divisor);
    sum += texel_w * tmp;

#if defined(UNIFORM_READ)
    tmp = id == 0 ? texels[2] : 
          id == 1 ? texels[3] :
          id == 2 ? texels[0] : texels[1];
#elif defined(NONUNIFORM_READ)
    tmp = texels[2];
#endif
    tmp += dFdyFine(tmp) * t.y;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(tmp - cental, tmp - cental) * params.intensities_divisor);
    sum += texel_w * tmp;

    color = vec4(sum / sum_w, 1.0);

#elif defined(USE_ONE_REG)
    vec2 t = vec2(ivec2(gl_FragCoord.xy) & 1) * -2.0 + 1.0;
    
    vec3 texel = textureLod(colorTex, texCoord + params.offset * vec2( 1,  1) * t, 0).rgb;

    vec3 cental = texel + dFdxFine(texel) * t.x;
    cental += dFdyFine(cental) * t.y;

    vec3 sum = cental;
    float sum_w = 1.0, texel_w;

    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = cental + dFdyFine(cental) * t.y;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdxFine(texel) * t.x;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( -1, 1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel += dFdyFine(texel) * t.y;
    sum_w += texel_w = exp(params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    texel = textureLod(colorTex, texCoord + params.offset * vec2( -1, -1) * t, 0).rgb;
    sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
    sum += texel_w * texel;

    color = vec4(sum / sum_w, 1.0);
#elif defined(ANOTHER_ONE)
    vec2 t = vec2((ivec2(gl_FragCoord.xy) & 1) * -2 + 1);
    
    vec3 texels[4]; 
    texels[0] = textureLod(colorTex, texCoord + params.offset * vec2(-1, -1) * t, 0).rgb;
    texels[1] = textureLod(colorTex, texCoord + params.offset * vec2( 1, -1) * t, 0).rgb;
    texels[2] = textureLod(colorTex, texCoord + params.offset * vec2(-1,  1) * t, 0).rgb;
    texels[3] = textureLod(colorTex, texCoord + params.offset * vec2( 1,  1) * t, 0).rgb;
    
    vec3 cental = texels[3] + dFdxFine(texels[3]) * t.x;
    cental += dFdyFine(cental) * t.y;

    vec3 sum = cental;
    float sum_w = 1.0, texel_w;

    for (int i = 0; i < 4; ++i)
    {
        sum_w += texel_w = exp(2.0 * params.gaussian_divisor + dot(texels[i] - cental, texels[i] - cental) * params.intensities_divisor);
        sum += texel_w * texels[i];
    }

    texels[0] = texels[3] + dFdxFine(texels[3]) * t.x;
    texels[3] += dFdyFine(texels[3]) * t.y;
    texels[1] += dFdxFine(texels[1]) * t.x;
    texels[2] += dFdyFine(texels[2]) * t.y;

    for (int i = 0; i < 4; ++i)
    {
        sum_w += texel_w = exp(params.gaussian_divisor + dot(texels[i] - cental, texels[i] - cental) * params.intensities_divisor);
        sum += texel_w * texels[i];
    }

    color = vec4(sum / sum_w, 1.0);
#endif
}
#version 450

layout(constant_id = 0) const int WINDOW_R = 1;

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
    vec3 cental = textureLod(colorTex, texCoord, 0).rgb;
    vec3 sum = cental;
    vec3 texel;
    float texel_w, sum_w = 1.0;

    for (int i = -WINDOW_R; i <= WINDOW_R; ++i)
    {
        for (int j = -WINDOW_R; j <= WINDOW_R; ++j)
        {
            if (i != 0 || j != 0)
            {
                texel = textureLod(colorTex, texCoord + params.offset * vec2(j, i), 0).rgb;
                texel_w = exp((i * i + j * j) * params.gaussian_divisor + dot(texel - cental, texel - cental) * params.intensities_divisor);
                sum += texel_w * texel;
                sum_w += texel_w;
            }
        }
    }
    
    color = vec4(sum / sum_w, 1.0);
}
# scripts/boost_iot_sec_day38.py
import json

def boost_day38():
    with open('scripts/iot_sec_day38.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p1_add = [
        "In statistical signal processing, the Pearson correlation coefficient can also be interpreted geometrically as the cosine of the angle between two centered vectors in N-dimensional Euclidean space. When the predicted hypothesis vector and the physical observation vector point in identical directions, the angle theta is 0 degrees and cos(theta) = 1.0. When they are orthogonal, theta is 90 degrees and cos(theta) = 0.0. This geometric perspective underscores why additive Gaussian noise diminishes correlation amplitude without altering the location of the maximum peak: noise acts as an orthogonal perturbation vector, increasing the denominator without shifting the primary collinear projection."
    ]

    p2_add = [
        "In addition to evaluating the first-round S-box substitution, the hypothetical power matrix can also be formulated for the MixColumns transformation or Round 2 state updates. However, because MixColumns diffuses each byte across four columns via matrix multiplication in GF(2^8), modeling Round 2 requires guessing 4 key bytes simultaneously (a 32-bit hypothesis space of 2^32 candidates), which is computationally prohibitive. Thus, practical side-channel attacks concentrate on Round 1 (input byte isolation) or Round 10 (output byte isolation without MixColumns diffusion), preserving the tractable 8-bit divide-and-conquer advantage."
    ]

    p3_add = [
        "When handling high-frequency noise in practical test benches, low-pass digital filtering must be tuned with extreme precision. A digital Butterworth filter with a cutoff frequency set too low will smear adjacent clock cycles together, blending the sensitive S-box calculation with neighboring round operations and diluting the Pearson correlation peak. Conversely, setting the cutoff frequency too high leaves wideband thermal hash intact. Hardware security analysts employ Power Spectral Density (PSD) analysis using the Fast Fourier Transform (FFT) to identify the microcontroller's exact clock harmonics, crafting sharp notch or bandpass filters that surgically isolate the active cryptographic bandwidth while preserving transient phase fidelity."
    ]

    p4_add = [
        "In high-assurance hardware evaluations, the CPA engine is often extended to execute Multi-Channel Correlation (MCC). When both power consumption through a shunt resistor and electromagnetic radiation captured via near-field probes are acquired simultaneously, the correlation engine evaluates both data streams in parallel. By combining power and EM correlation matrices using weighted Euclidean distance fusion, the separation margin between the authentic subkey and ghost candidates increases by up to 40%, enabling successful key disclosure even in the presence of localized power smoothing circuits."
    ]

    p5_add = [
        "Beyond first-order TVLA, advanced certification standards mandate Second-Order and Higher-Order TVLA to assess masked implementations. In second-order TVLA, the trace data is first centered and squared (or pairs of time samples are multiplied together) before calculating Welch's t-statistic. This tests whether non-linear variance leakages exist in implementations where first-order means are equalized. Passing both first-order (|t| <= 4.5) and second-order TVLA over 100,000 traces is the mandatory silicon milestone required for Common Criteria EAL 5+ cryptographic hardware certification."
    ]

    d['parts'][0]['say'].extend(p1_add)
    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day38.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)

    print("Successfully boosted Day 38!")

if __name__ == '__main__':
    boost_day38()

// blogData.js
export const blogPosts = [
  {
    id: 1,
    slug: 'why-we-focus-on-ctdna',
    title: 'Why We Focus on ctDNA Over CTCs',
    subtitle: 'For AI-Powered Realtime Precision Monitoring of Oncology, circulating tumor DNA offers a scientifically validated and computationally robust foundation.',
    author: 'OncoTrace AI Research Team',
    date: '2024-01-15',
    readTime: 12,
    category: 'Research',
    tags: ['ctDNA', 'Liquid Biopsy', 'Precision Oncology', 'AI'],
    featured: true,
    metaDescription: 'Discover why ctDNA is the optimal biomarker for AI-powered realtime cancer monitoring compared to CTCs.',
    metaKeywords: 'ctDNA, circulating tumor DNA, CTCs, liquid biopsy, precision oncology, cancer monitoring, AI cancer detection',
    
    // Featured images
    images: [
      {
        src: '/blog/blog1rsc1.webp',
        alt: 'Molecular structure and sequencing data visualization showing ctDNA analysis',
        caption: 'Advanced sequencing technologies enable precise detection of circulating tumor DNA fragments in blood samples',
        position: 'after-intro' // Options: 'after-intro', 'after-comparison', 'after-reasons', 'custom'
      },
      {
        src: '/blog/blog1rsc2.webp',
        alt: 'AI-powered genomic analysis and tumor heterogeneity mapping',
        caption: 'Machine learning algorithms process ctDNA data to track tumor evolution and treatment response in real-time',
        position: 'after-comparison'
      }
    ],

    // Content sections
    content: {
      intro: [
        'Cancer is not a fixed disease. It evolves over time, adapts to treatment, and can develop resistance. However, many traditional monitoring methods rely on periodic imaging or invasive biopsies — approaches that provide only occasional snapshots of a constantly changing condition.',
        'As oncology moves toward precision medicine, the need for realtime molecular monitoring has become increasingly important. Liquid biopsy technologies now allow us to track cancer non-invasively using blood samples. Two key biomarkers have emerged in this space: Circulating Tumor Cells (CTCs) and Circulating Tumor DNA (ctDNA).',
        'Both have strong scientific value. However, for building an AI-Powered Realtime Precision Monitoring platform, we have chosen to focus primarily on ctDNA — a choice reflecting biological evidence, clinical validation, data compatibility with AI systems, and practical scalability.'
      ],

      sections: [
        {
          eyebrow: 'Understanding the Difference',
          title: 'Two Biomarkers, One Clear Choice',
          description: 'Both CTCs and ctDNA emerge from tumors into the bloodstream, but they differ fundamentally in their biology, measurability, and compatibility with scalable AI systems.',
          
          comparison: [
            {
              title: 'CTCs',
              subtitle: 'Intact cancer cells shed from tumors into the bloodstream',
              points: [
                'Provides tumor morphology and protein expression data',
                'Validated prognostic value in breast, prostate, colorectal cancers',
                'Extremely rare — few cells among billions of normal blood cells',
                'Requires specialized enrichment; platform variability a challenge',
                'Valuable for research but less suited for high-frequency, scalable monitoring'
              ]
            },
            {
              title: 'ctDNA',
              subtitle: 'Tumor-derived DNA fragments carrying specific genetic alterations',
              points: [
                'Somatic mutations, copy number changes, structural rearrangements',
                'Evenly distributed in plasma — quantitatively measurable',
                'Levels reflect tumor burden dynamically over time',
                'Directly compatible with AI/ML pipelines and longitudinal modeling',
                'Scalable, automatable, and standardizable across institutions'
              ]
            }
          ],

          stats: [
            { value: 'Months', label: 'Earlier relapse detection vs. radiographic imaging' },
            { value: 'Multi-site', label: 'Tumor heterogeneity represented by shed ctDNA' },
            { value: 'Realtime', label: 'Molecular surveillance enabled by quantitative ctDNA' }
          ]
        },

        {
          eyebrow: 'Scientific Rationale',
          title: 'Why ctDNA Aligns with AI-Powered Realtime Monitoring',
          description: 'Five interconnected reasons — rooted in peer-reviewed evidence — explain why ctDNA is the optimal biomarker for a continuous, AI-driven oncology monitoring platform.',
          
          reasons: [
            {
              number: '01',
              title: 'High Sensitivity for Minimal Residual Disease',
              content: [
                'ctDNA has demonstrated strong sensitivity in detecting minimal residual disease (MRD) using advanced sequencing technologies. This is critical for post-surgical monitoring and catching molecular relapse before it becomes clinically apparent.',
                'Longitudinal ctDNA analysis has also been shown to identify relapse months before radiographic progression in lung cancer, creating a window for earlier therapeutic intervention.'
              ],
              quote: 'Detectable ctDNA after surgery can predict colorectal cancer recurrence earlier than imaging — a signal that directly changes clinical decision-making.',
              citations: ['Tie et al., NEJM 2016', 'Abbosh et al., Nature 2017']
            },
            {
              number: '02',
              title: 'Quantifiable and AI-Compatible Data',
              content: [
                'AI systems require structured, numerical, and longitudinal datasets. ctDNA testing naturally produces mutation allele frequencies, time-series measurements, clonal evolution profiles, and emergence of resistance mutations.',
                'These outputs integrate directly into machine learning models for predicting recurrence risk, tracking treatment response, modeling tumor evolution, and identifying resistance patterns.'
              ],
              quote: 'CTC analysis often involves imaging, staining, and morphological interpretation — biologically informative but introducing variability when building standardized AI pipelines. ctDNA offers a directly quantifiable molecular signal.',
              citations: ['Wan et al., Nature Reviews Cancer 2017', 'Heitzer et al., Nature Reviews Genetics 2019']
            },
            {
              number: '03',
              title: 'Broader Representation of Tumor Heterogeneity',
              content: [
                'Tumors are often genetically diverse, especially in metastatic disease. A single tissue biopsy captures only one location at one time point — a fundamental limitation in understanding the full landscape of a patient\'s disease.',
                'ctDNA may reflect DNA shed from multiple tumor sites simultaneously, providing a broader molecular overview. Studies have shown that ctDNA levels correlate strongly with tumor burden and can sometimes outperform CTC enumeration in this regard.'
              ],
              quote: 'CTCs offer advantages when studying cellular behavior and metastatic potential at the single-cell level. For systemic molecular monitoring over time, ctDNA provides practical and biological advantages.',
              citations: ['Dawson et al., NEJM 2013']
            },
            {
              number: '04',
              title: 'Dynamic Monitoring of Treatment Response',
              content: [
                'ctDNA levels can change rapidly in response to therapy. A decrease may indicate effective treatment, while rising levels may suggest resistance — sometimes before imaging detects progression. This dynamic responsiveness is essential for realtime monitoring systems.',
                'Although CTC trends can also provide prognostic insight, ctDNA\'s quantitative molecular nature makes it particularly suitable for continuous tracking, predictive modeling, and adaptive treatment strategies.'
              ],
              quote: 'ctDNA monitoring has been shown to predict treatment outcomes and relapse earlier than conventional methods in lung cancer, enabling proactive rather than reactive oncology care.',
              citations: ['Chaudhuri et al., Nature 2017', 'Murtaza et al., Nature 2013']
            },
            {
              number: '05',
              title: 'Scalability and Standardization',
              content: [
                'An AI-Powered Realtime Precision Monitoring platform must be reproducible, scalable, standardized, and automation-ready. These operational requirements shape which biomarker technologies are viable at population scale.',
                'Plasma-based ctDNA workflows integrate well with automated sequencing and bioinformatics systems. CTC workflows, while powerful, often require more complex enrichment and handling processes that introduce variability across sites.'
              ],
              quote: 'For broad deployment across institutions and patient populations, operational simplicity and consistency are not secondary concerns — they are prerequisites for clinical utility.',
              citations: ['Heitzer et al., Nature Reviews Genetics 2019']
            }
          ]
        },

        {
          eyebrow: 'Looking Forward',
          title: 'The Future of Realtime Oncology Monitoring',
          content: [
            'The future of oncology will move beyond periodic imaging toward continuous molecular insight. As sequencing technologies advance and AI models mature, realtime data will increasingly guide treatment decisions. Precision oncology is not only about choosing the right therapy — it is about continuously understanding the disease as it evolves.'
          ],
          pillars: [
            {
              title: 'Earlier Detection',
              description: 'Disease progression detected at the molecular level, before clinical symptoms'
            },
            {
              title: 'Resistance Identification',
              description: 'Resistance mechanisms identified sooner, enabling timely therapeutic pivots'
            },
            {
              title: 'Dynamic Adaptation',
              description: 'Treatment strategies that adapt in realtime to evolving molecular signals'
            },
            {
              title: 'Proactive Care',
              description: 'Monitoring becomes proactive rather than reactive, shifting oncology\'s paradigm'
            }
          ]
        }
      ],

      references: [
        {
          id: 1,
          title: 'Circulating Tumor DNA Analysis Detects Minimal Residual Disease and Predicts Recurrence in Patients With Stage II Colon Cancer',
          authors: 'Tie J, et al.',
          journal: 'New England Journal of Medicine',
          year: '2016',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1610013'
        },
        {
          id: 2,
          title: 'Phylogenetic ctDNA Analysis Depicts Early-Stage Lung Cancer Evolution',
          authors: 'Abbosh C, et al.',
          journal: 'Nature',
          year: '2017',
          url: 'https://www.nature.com/articles/nature22364'
        },
        {
          id: 3,
          title: 'Early Detection of Molecular Residual Disease in Localized Lung Cancer by Circulating Tumor DNA Profiling',
          authors: 'Chaudhuri AA, et al.',
          journal: 'Nature',
          year: '2017',
          url: 'https://www.nature.com/articles/nature21059'
        },
        {
          id: 4,
          title: 'Analysis of Circulating Tumor DNA to Monitor Metastatic Breast Cancer',
          authors: 'Dawson SJ, et al.',
          journal: 'New England Journal of Medicine',
          year: '2013',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1213261'
        },
        {
          id: 5,
          title: 'Circulating Tumor Cells, Disease Progression, and Survival in Metastatic Breast Cancer',
          authors: 'Cristofanilli M, et al.',
          journal: 'New England Journal of Medicine',
          year: '2004',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa040766'
        },
        {
          id: 6,
          title: 'Liquid Biopsies Come of Age: Towards Implementation of Circulating Tumour DNA',
          authors: 'Wan JCM, et al.',
          journal: 'Nature Reviews Cancer',
          year: '2017',
          url: 'https://www.nature.com/articles/nrc.2017.7'
        },
        {
          id: 7,
          title: 'Current and Future Perspectives of Liquid Biopsies in Genomics-Driven Oncology',
          authors: 'Heitzer E, Haque IS, Roberts CES, Speicher MR',
          journal: 'Nature Reviews Genetics',
          year: '2019',
          url: 'https://www.nature.com/articles/s41576-019-0181-3'
        },
        {
          id: 8,
          title: 'Non-Invasive Analysis of Acquired Resistance to Cancer Therapy by Sequencing of Plasma DNA',
          authors: 'Murtaza M, et al.',
          journal: 'Nature',
          year: '2013',
          url: 'https://www.nature.com/articles/nature12065'
        }
      ]
    }
  }

  // Add new blog posts here weekly:
  // {
  //   id: 2,
  //   slug: 'next-blog-post',
  //   title: '...',
  //   images: [...],
  //   ...
  // }
];

// Helper functions
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);
export const getPostBySlug = (slug) => blogPosts.find(post => post.slug === slug);
export const getRelatedPosts = (currentSlug, limit = 3) => {
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit);
};
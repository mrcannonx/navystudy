import { MetricsLibrary, SectionKey } from '../types';
import { appendToSection } from './section-utils';
import { debug } from './error-utils';

/**
 * Adds a metric to a section's content
 */
export const addMetricToSection = (
  sections: any,
  sectionKey: SectionKey,
  metric: string
) => {
  // Validate inputs
  if (!sections) {
    return sections;
  }
  
  if (!sectionKey) {
    return sections;
  }
  
  if (!metric) {
    return sections;
  }
  
  if (!sections[sectionKey]) {
    return sections;
  }
  
  // Check if metric contains placeholders
  if (metric.includes('##')) {
    // In a browser environment, we would prompt the user
    // Since we can't do that in this context, we'll use a more intelligent default
    // based on the metric type
    
    let defaultValue = '5';
    
    // Determine a reasonable default based on the metric content
    if (metric.includes('uptime') || metric.includes('accuracy') || metric.includes('improvement')) {
      defaultValue = '95';
    } else if (metric.includes('reduction')) {
      defaultValue = '25';
    } else if (metric.includes('hours')) {
      defaultValue = '12';
    } else if (metric.includes('personnel') || metric.includes('sailors')) {
      defaultValue = '4';
    }
    
    const processedMetric = metric.replace(/##/g, defaultValue);
    
    // Return the updated sections with the metric appended
    return appendToSection(sections, sectionKey, processedMetric);
  }
  
  // If no placeholders, just add the metric as is
  return appendToSection(sections, sectionKey, metric);
};

/**
 * Adds a custom metric to the metrics library
 */
export const addCustomMetric = (
  metricsLibrary: MetricsLibrary,
  metric: string,
  section: SectionKey
): MetricsLibrary => {
  if (!metric || !section) {
    debug('Cannot add custom metric: missing metric or section');
    return metricsLibrary;
  }

  debug(`Adding custom metric "${metric}" to section ${section}`);
  
  // Check if metric already exists to avoid duplicates
  if (metricsLibrary[section] && metricsLibrary[section].includes(metric)) {
    debug(`Metric "${metric}" already exists in section ${section}`);
    return metricsLibrary;
  }

  return {
    ...metricsLibrary,
    [section]: [
      ...(metricsLibrary[section] || []),
      metric
    ]
  };
};

/**
 * Removes a metric from the metrics library
 */
export const deleteMetric = (
  metricsLibrary: MetricsLibrary,
  metric: string,
  section: SectionKey
): MetricsLibrary => {
  if (!metric || !section || !metricsLibrary[section]) {
    debug('Cannot delete metric: missing metric, section, or section not in library');
    return metricsLibrary;
  }

  debug(`Deleting metric "${metric}" from section ${section}`);
  
  return {
    ...metricsLibrary,
    [section]: metricsLibrary[section].filter((m: string) => m !== metric)
  };
};

/**
 * Gets metrics for a specific section
 */
export const getMetricsForSection = (
  metricsLibrary: MetricsLibrary,
  section: SectionKey
): string[] => {
  debug(`Getting metrics for section: ${section}`);
  return metricsLibrary[section] || [];
};

/**
 * Checks if a metric already exists in a section
 */
export const metricExistsInSection = (
  metricsLibrary: MetricsLibrary,
  metric: string,
  section: SectionKey
): boolean => {
  if (!metricsLibrary[section]) {
    debug(`Section ${section} does not exist in metrics library`);
    return false;
  }
  
  const exists = metricsLibrary[section].includes(metric);
  debug(`Metric "${metric}" ${exists ? 'exists' : 'does not exist'} in section ${section}`);
  return exists;
};
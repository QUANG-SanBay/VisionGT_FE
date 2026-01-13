// Central exports for pages used by the router
// Keep exports small and explicit so routes can import named components
export { default as Detection } from './customer/detection/Detection';

// Admin pages for managing detections and dashboard
export { default as DetectionList } from './admin/detections/DetectionList';
export { default as DetectionDetail } from './admin/detections/DetectionDetail';
export { default as Dashboard } from './admin/dashboard/Dashboard';
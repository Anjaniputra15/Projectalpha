
import { gapi } from 'gapi-script';

// Initialize the Google API client
export const initGoogleApi = async () => {
  try {
    await gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      clientId: '212167030197-r4ll9d3ocg1487g8v5cn8qhrpevtt65h.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: 'https://www.googleapis.com/auth/drive.file'
    });
    
    // Load the Drive API
    await gapi.client.load('drive', 'v3');
  } catch (error) {
    console.error('Error initializing Google API:', error);
  }
};

// Create a new Google Doc
export const createGoogleDoc = async (title: string) => {
  try {
    const response = await gapi.client.drive.files.create({
      resource: {
        name: title,
        mimeType: 'application/vnd.google-apps.document'
      }
    });

    return {
      id: response.result.id,
      url: `https://docs.google.com/document/d/${response.result.id}/edit`
    };
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    throw error;
  }
};

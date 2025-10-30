import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER: 'user',
  POSTS: 'posts',
  CONSULTATIONS: 'consultations',
};

// User storage
export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Posts storage
export const savePosts = async (posts) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
};

export const getPosts = async () => {
  try {
    const posts = await AsyncStorage.getItem(STORAGE_KEYS.POSTS);
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const addPost = async (post) => {
  try {
    const posts = await getPosts();
    posts.unshift(post); // Add to beginning
    await savePosts(posts);
  } catch (error) {
    console.error('Error adding post:', error);
  }
};

// Consultations storage
export const saveConsultations = async (consultations) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  } catch (error) {
    console.error('Error saving consultations:', error);
  }
};

export const getConsultations = async () => {
  try {
    const consultations = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return consultations ? JSON.parse(consultations) : [];
  } catch (error) {
    console.error('Error getting consultations:', error);
    return [];
  }
};

export const addConsultation = async (consultation) => {
  try {
    const consultations = await getConsultations();
    consultations.unshift(consultation); // Add to beginning
    await saveConsultations(consultations);
  } catch (error) {
    console.error('Error adding consultation:', error);
  }
};
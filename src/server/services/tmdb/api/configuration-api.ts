import { ITmdbConfiguration } from '../../../models/tmdb';

export type ITmdbConfigurationApi = () => Promise<ITmdbConfiguration>;

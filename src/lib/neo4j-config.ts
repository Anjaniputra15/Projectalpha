// src/lib/neo4j-config.ts
import { createDriver } from 'use-neo4j';

// Neo4j connection details
// In a production environment, these should come from environment variables
const NEO4J_PROTOCOL = import.meta.env.VITE_NEO4J_PROTOCOL || 'neo4j';
const NEO4J_HOST = import.meta.env.VITE_NEO4J_HOST || 'localhost';
const NEO4J_PORT = parseInt(import.meta.env.VITE_NEO4J_PORT || '7687', 10);
const NEO4J_USERNAME = import.meta.env.VITE_NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = import.meta.env.VITE_NEO4J_PASSWORD || 'password';

/**
 * Creates a Neo4j driver instance with the configured connection details
 */
export const createNeo4jDriver = () => {
  try {
    return createDriver(
      NEO4J_PROTOCOL,
      NEO4J_HOST,
      NEO4J_PORT,
      NEO4J_USERNAME,
      NEO4J_PASSWORD
    );
  } catch (error) {
    console.error('Failed to create Neo4j driver:', error);
    throw error;
  }
};

/**
 * Configuration object for Neo4j
 */
export const neo4jConfig = {
  protocol: NEO4J_PROTOCOL,
  host: NEO4J_HOST,
  port: NEO4J_PORT,
  username: NEO4J_USERNAME,
  // Password is not included in the exported config for security reasons
};
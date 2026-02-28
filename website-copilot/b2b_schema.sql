-- B2B Architecture Schema
-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests table for customer queries
CREATE TABLE requests (
    request_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id),
    agent_id INTEGER REFERENCES users(id),
    request_text TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Responses table for agent replies
CREATE TABLE responses (
    response_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(request_id),
    hotel_list JSONB NOT NULL,
    sent_to_customer BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users (1 agent, 3 customers)
-- Password: 'password123' (in production, use bcrypt hashing)
INSERT INTO users (name, email, password, role) VALUES
('Agent Smith', 'agent@tbo.com', 'password123', 'agent'),
('John Customer', 'john@customer.com', 'password123', 'customer'),
('Sarah Customer', 'sarah@customer.com', 'password123', 'customer'),
('Mike Customer', 'mike@customer.com', 'password123', 'customer');

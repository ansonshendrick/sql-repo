-- Create the departments table
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT
);

-- Create the roles table
CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  title TEXT,
  salary REAL,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create the employees table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role_id INTEGER,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

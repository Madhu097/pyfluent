-- ============================================
-- SEED DATA FOR FIRST 3 MISSIONS
-- ============================================

-- Mission 1: Python Basics & Print
INSERT INTO missions (id, day_number, title, description, week_number, is_project, xp_reward, is_published)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 1, 'Python Basics & Print', 'Learn the fundamentals of Python and how to display output', 1, FALSE, 100, TRUE);

-- Mission 2: Variables & Types
INSERT INTO missions (id, day_number, title, description, week_number, is_project, xp_reward, is_published)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 2, 'Variables & Data Types', 'Understand how to store and work with different types of data', 1, FALSE, 100, TRUE);

-- Mission 3: Input/Output Formatting
INSERT INTO missions (id, day_number, title, description, week_number, is_project, xp_reward, is_published)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 3, 'Input & Output Formatting', 'Master user input and formatted output in Python', 1, FALSE, 100, TRUE);

-- ============================================
-- LESSON 1: Python Basics & Print
-- ============================================
INSERT INTO lessons (mission_id, content, estimated_time_10min, estimated_time_20min, estimated_time_30min)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '# Welcome to Python Programming!

## What is Python?

Python is a **high-level programming language** that is widely used in software development, data science, web development, and automation. It''s known for being **readable** and **beginner-friendly**.

## Your First Python Program

The most basic Python command is `print()`. It displays output on the screen.

```python
print("Hello, World!")
```

**Output:**
```
Hello, World!
```

## Key Concepts

### 1. The print() Function

- `print()` is a **built-in function** in Python
- It takes one or more **arguments** (values inside the parentheses)
- Arguments can be text (strings), numbers, or variables

### 2. Strings

Text in Python must be enclosed in quotes:
- Single quotes: `''Hello''`
- Double quotes: `"Hello"`

Both work the same way!

### 3. Multiple Arguments

You can print multiple items separated by commas:

```python
print("Python", "is", "awesome")
```

**Output:**
```
Python is awesome
```

## Common Use Cases

In real development, `print()` is used for:
- **Debugging**: Checking variable values
- **Logging**: Recording program execution
- **User feedback**: Showing messages to users

## Developer Vocabulary

- **Function**: A reusable block of code that performs a specific task
- **Argument**: A value passed to a function
- **Output**: The result displayed by a program
- **String**: Text data enclosed in quotes

## Practice Exercise

Try printing your name and your goal for learning Python!

```python
print("My name is Alex")
print("I want to learn Python to build web applications")
```

---

**Remember**: In professional development, clear output messages help with debugging and user experience!',
  3,
  5,
  8
);

-- ============================================
-- LESSON 2: Variables & Types
-- ============================================
INSERT INTO lessons (mission_id, content, estimated_time_10min, estimated_time_20min, estimated_time_30min)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '# Variables & Data Types

## What are Variables?

A **variable** is a container that stores data. Think of it as a labeled box where you can put information.

```python
name = "Sarah"
age = 25
is_developer = True
```

## Variable Naming Rules

✅ **Good variable names:**
- `user_name`
- `total_price`
- `is_active`

❌ **Invalid variable names:**
- `2nd_value` (can''t start with a number)
- `user-name` (no hyphens)
- `class` (reserved keyword)

## Data Types in Python

### 1. String (str)
Text data enclosed in quotes:
```python
language = "Python"
message = ''Learning is fun!''
```

### 2. Integer (int)
Whole numbers:
```python
age = 30
year = 2024
```

### 3. Float
Decimal numbers:
```python
price = 19.99
temperature = 36.6
```

### 4. Boolean (bool)
True or False values:
```python
is_logged_in = True
has_permission = False
```

## Type Checking

Use `type()` to check a variable''s data type:

```python
name = "Alice"
print(type(name))  # <class ''str''>

age = 25
print(type(age))   # <class ''int''>
```

## Professional Naming Conventions

In Python, we use **snake_case** for variables:
- `user_email` ✅
- `userEmail` ❌ (this is camelCase, used in JavaScript)
- `UserEmail` ❌ (this is PascalCase, used for classes)

## Real-World Example

```python
# E-commerce application
product_name = "Laptop"
product_price = 899.99
in_stock = True
quantity = 15

print("Product:", product_name)
print("Price: $", product_price)
print("Available:", in_stock)
```

## Developer Vocabulary

- **Variable**: A named storage location for data
- **Data type**: The kind of value a variable holds
- **Assignment**: Giving a value to a variable using `=`
- **Constant**: A variable whose value shouldn''t change (written in UPPERCASE)

---

**Best Practice**: Use descriptive variable names that explain what the data represents!',
  3,
  5,
  8
);

-- ============================================
-- LESSON 3: Input & Output Formatting
-- ============================================
INSERT INTO lessons (mission_id, content, estimated_time_10min, estimated_time_20min, estimated_time_30min)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '# Input & Output Formatting

## Getting User Input

The `input()` function allows users to enter data:

```python
name = input("Enter your name: ")
print("Hello,", name)
```

**Important**: `input()` always returns a **string**, even if the user enters a number!

## Converting Input Types

To work with numbers, convert the input:

```python
age = input("Enter your age: ")
age = int(age)  # Convert string to integer

price = input("Enter price: ")
price = float(price)  # Convert string to float
```

**Shortcut:**
```python
age = int(input("Enter your age: "))
```

## Formatted Output

### Method 1: f-strings (Modern & Recommended)

```python
name = "Alex"
age = 28
print(f"My name is {name} and I am {age} years old")
```

**Output:**
```
My name is Alex and I am 28 years old
```

### Method 2: .format() Method

```python
print("My name is {} and I am {} years old".format(name, age))
```

### Method 3: % Formatting (Old Style)

```python
print("My name is %s and I am %d years old" % (name, age))
```

**Best Practice**: Use **f-strings** in modern Python code!

## Advanced Formatting

### Decimal Places
```python
price = 19.99567
print(f"Price: ${price:.2f}")  # Price: $19.99
```

### Padding & Alignment
```python
name = "Python"
print(f"{name:>10}")   # Right-align in 10 spaces
print(f"{name:<10}")   # Left-align in 10 spaces
print(f"{name:^10}")   # Center in 10 spaces
```

## Real-World Example: User Registration

```python
print("=== User Registration ===")
username = input("Choose a username: ")
email = input("Enter your email: ")
age = int(input("Enter your age: "))

print(f"\\nAccount created successfully!")
print(f"Username: {username}")
print(f"Email: {email}")
print(f"Age: {age}")
```

## Developer Vocabulary

- **Input**: Data received from the user
- **Type conversion**: Changing data from one type to another
- **String interpolation**: Inserting variables into strings
- **Formatting**: Controlling how output is displayed

## Common Mistakes

❌ **Forgetting to convert input:**
```python
age = input("Age: ")
next_year = age + 1  # Error! Can''t add string and int
```

✅ **Correct approach:**
```python
age = int(input("Age: "))
next_year = age + 1  # Works!
```

---

**Professional Tip**: Always validate user input in production applications to prevent errors!',
  3,
  5,
  8
);

-- ============================================
-- VOCABULARY WORDS - Mission 1
-- ============================================
INSERT INTO vocab_words (mission_id, word, meaning, example_sentence, category)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'function', 'A reusable block of code that performs a specific task', 'The print() function displays output to the console.', 'programming'),
  ('11111111-1111-1111-1111-111111111111', 'argument', 'A value passed to a function when calling it', 'We pass the string "Hello" as an argument to print().', 'programming'),
  ('11111111-1111-1111-1111-111111111111', 'output', 'The result or data produced by a program', 'The output of our program appears in the terminal.', 'programming'),
  ('11111111-1111-1111-1111-111111111111', 'syntax', 'The set of rules that define how code must be written', 'Python syntax requires proper indentation.', 'programming'),
  ('11111111-1111-1111-1111-111111111111', 'debug', 'To find and fix errors in code', 'We need to debug this function because it returns incorrect values.', 'workplace');

-- VOCABULARY WORDS - Mission 2
INSERT INTO vocab_words (mission_id, word, meaning, example_sentence, category)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'variable', 'A named container that stores data in memory', 'We store the user''s name in a variable called username.', 'programming'),
  ('22222222-2222-2222-2222-222222222222', 'type', 'The category of data a value belongs to', 'The type of "Hello" is string, while 42 is an integer.', 'programming'),
  ('22222222-2222-2222-2222-222222222222', 'assign', 'To give a value to a variable', 'We assign the value 10 to the variable count.', 'programming'),
  ('22222222-2222-2222-2222-222222222222', 'convention', 'A widely accepted standard or practice', 'Following naming conventions makes code more readable.', 'workplace'),
  ('22222222-2222-2222-2222-222222222222', 'requirement', 'A necessary condition or specification', 'The project requirement states that all variables must be typed.', 'workplace');

-- VOCABULARY WORDS - Mission 3
INSERT INTO vocab_words (mission_id, word, meaning, example_sentence, category)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'input', 'Data received from an external source like a user', 'The program waits for user input before continuing.', 'programming'),
  ('33333333-3333-3333-3333-333333333333', 'convert', 'To change data from one type to another', 'We convert the string to an integer using int().', 'programming'),
  ('33333333-3333-3333-3333-333333333333', 'format', 'To arrange or structure data in a specific way', 'We format the output to display two decimal places.', 'programming'),
  ('33333333-3333-3333-3333-333333333333', 'validate', 'To check if data meets certain criteria', 'We must validate user input to prevent errors.', 'workplace'),
  ('33333333-3333-3333-3333-333333333333', 'therefore', 'As a result; for that reason', 'The input is a string; therefore, we must convert it to int.', 'connectors');

-- ============================================
-- CODING TASKS - Mission 1
-- ============================================
INSERT INTO coding_tasks (mission_id, task_type, prompt, starter_code, expected_answer, explanation, options, order_index)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'fill-blank', 'Complete the code to print "Python is awesome"', 'print(___)', 'print("Python is awesome")', 'The print() function requires the text to be enclosed in quotes (either single or double).', NULL, 1),
  ('11111111-1111-1111-1111-111111111111', 'predict-output', 'What will this code output?\n\nprint("Hello", "World")', NULL, 'Hello World', 'When multiple arguments are passed to print(), they are separated by spaces in the output.', NULL, 2),
  ('11111111-1111-1111-1111-111111111111', 'mcq', 'Which of the following is the correct way to print text in Python?', NULL, 'print("Hello")', 'The print() function requires parentheses and quotes around text strings.', '["print(Hello)", "print(\"Hello\")", "Print(\"Hello\")", "PRINT(\"Hello\")"]', 3);

-- CODING TASKS - Mission 2
INSERT INTO coding_tasks (mission_id, task_type, prompt, starter_code, expected_answer, explanation, options, order_index)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'fill-blank', 'Create a variable named age and assign it the value 25', '___ = ___', 'age = 25', 'Variables are created using the assignment operator (=). The variable name goes on the left, the value on the right.', NULL, 1),
  ('22222222-2222-2222-2222-222222222222', 'predict-output', 'What is the type of the variable?\n\nprice = 19.99\nprint(type(price))', NULL, '<class ''float''>', 'Numbers with decimal points are float type in Python.', NULL, 2),
  ('22222222-2222-2222-2222-222222222222', 'fix-bug', 'Fix the variable name:\n\n2nd_value = 100', NULL, 'second_value = 100', 'Variable names cannot start with a number. Use words like "second" instead of "2nd".', '["value_2 = 100", "second_value = 100", "_2nd_value = 100", "value2 = 100"]', 3);

-- CODING TASKS - Mission 3
INSERT INTO coding_tasks (mission_id, task_type, prompt, starter_code, expected_answer, explanation, options, order_index)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'fill-blank', 'Get the user''s name and store it in a variable', 'name = ___(___)', 'name = input("Enter your name: ")', 'The input() function is used to get user input. The prompt message goes inside the parentheses.', NULL, 1),
  ('33333333-3333-3333-3333-333333333333', 'predict-output', 'What will this code output?\n\nname = "Alice"\nage = 30\nprint(f"{name} is {age} years old")', NULL, 'Alice is 30 years old', 'F-strings allow you to embed variables directly in strings using curly braces {}.', NULL, 2),
  ('33333333-3333-3333-3333-333333333333', 'mcq', 'What does input() always return?', NULL, 'A string', 'The input() function always returns a string, even if the user enters a number.', '["An integer", "A string", "A float", "A boolean"]', 3);

-- ============================================
-- QUIZZES - Create quiz entries
-- ============================================
INSERT INTO quizzes (id, mission_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333');

-- ============================================
-- QUIZ QUESTIONS - Mission 1
-- ============================================
INSERT INTO quiz_questions (quiz_id, question_type, question_text, code_snippet, options, correct_answer, explanation, order_index)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'What is Python primarily known for?', NULL, '["Being fast", "Being readable and beginner-friendly", "Being old", "Being difficult"]', 'Being readable and beginner-friendly', 'Python is designed to be easy to read and learn, making it perfect for beginners.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'Which function is used to display output in Python?', NULL, '["show()", "print()", "display()", "output()"]', 'print()', 'The print() function is the built-in function for displaying output.', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'predict-output', 'What will be the output?', 'print("Python", 2024)', '["Python 2024", "Python2024", "Error", "Python, 2024"]', 'Python 2024', 'Multiple arguments in print() are separated by spaces by default.', 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'Which of these is a valid string in Python?', NULL, '["Hello", "\"Hello\"", "''Hello''", "Both B and C"]', 'Both B and C', 'Strings can be enclosed in either double quotes or single quotes.', 4),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'What is a function in programming?', NULL, '["A variable", "A reusable block of code", "A data type", "An error"]', 'A reusable block of code', 'Functions are blocks of code designed to perform specific tasks and can be reused.', 5);

-- QUIZ QUESTIONS - Mission 2
INSERT INTO quiz_questions (quiz_id, question_type, question_text, code_snippet, options, correct_answer, explanation, order_index)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'What is a variable?', NULL, '["A fixed value", "A container for storing data", "A function", "A data type"]', 'A container for storing data', 'Variables are named containers that store data values.', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'Which is a valid variable name?', NULL, '["2nd_value", "user_name", "user-name", "class"]', 'user_name', 'Variable names must start with a letter or underscore and use underscores instead of hyphens.', 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'predict-output', 'What is the output?', 'age = 25\nprint(type(age))', '["<class ''int''>", "<class ''str''>", "25", "int"]', '<class ''int''>', 'The type() function returns the data type, and 25 is an integer.', 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'What data type is True/False?', NULL, '["String", "Integer", "Boolean", "Float"]', 'Boolean', 'Boolean is the data type for True and False values.', 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'What naming convention does Python use for variables?', NULL, '["camelCase", "PascalCase", "snake_case", "kebab-case"]', 'snake_case', 'Python uses snake_case (lowercase with underscores) for variable names.', 5);

-- QUIZ QUESTIONS - Mission 3
INSERT INTO quiz_questions (quiz_id, question_type, question_text, code_snippet, options, correct_answer, explanation, order_index)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'What does the input() function return?', NULL, '["Integer", "String", "Float", "Boolean"]', 'String', 'The input() function always returns a string, regardless of what the user types.', 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'How do you convert a string to an integer?', NULL, '["str()", "int()", "float()", "convert()"]', 'int()', 'The int() function converts a value to an integer.', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'predict-output', 'What is the output?', 'name = "Bob"\nage = 20\nprint(f"{name} is {age}")', '["Bob is 20", "{name} is {age}", "name is age", "Error"]', 'Bob is 20', 'F-strings (f"...") allow variable interpolation using curly braces.', 3),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'Which is the modern way to format strings in Python?', NULL, '["% formatting", ".format()", "f-strings", "concat()"]', 'f-strings', 'F-strings (f"...") are the modern, recommended way to format strings in Python 3.6+.', 4),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'predict-output', 'What is the output?', 'price = 19.99567\nprint(f"{price:.2f}")', '["19.99567", "19.99", "20.00", "19.9"]', '19.99', 'The :.2f format specifier rounds to 2 decimal places.', 5);

-- ============================================
-- ENGLISH WRITING TASKS
-- ============================================
INSERT INTO english_writing_tasks (mission_id, task_type, prompt, context, min_words, max_words)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'explain-solution', 'Explain in 2 lines how the print() function works and why it''s useful for developers.', 'You just learned about the print() function.', 15, 40),
  ('22222222-2222-2222-2222-222222222222', 'code-comment', 'Write a professional comment explaining what this code does: age = int(input("Enter age: "))', 'Think about what a teammate would need to know.', 10, 30),
  ('33333333-3333-3333-3333-333333333333', 'explain-solution', 'Explain why we need to convert input() to int() when working with numbers.', 'Consider type compatibility.', 15, 40);

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set.');
}

// Existing calculator logic here, utilizing SECRET_KEY where necessary.
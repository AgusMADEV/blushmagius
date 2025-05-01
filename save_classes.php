<?php
// Set the response header
header("Content-Type: text/plain");

// Read the POSTed JSON data
$data = file_get_contents("php://input");
$classes = json_decode($data, true);

if ($classes === null) {
    http_response_code(400);
    echo "Invalid JSON data.";
    exit;
}

// Directory where the class files will be saved
$dir = 'classes';

// Create the directory if it doesn't exist
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

foreach ($classes as $classData) {
    $className = trim($classData['className']);

    // Sanitize the class name: remove non-alphanumeric/underscore characters
    $sanitizedClassName = preg_replace('/[^A-Za-z0-9_]/', '', $className);
    if (empty($sanitizedClassName)) {
        $sanitizedClassName = 'UnnamedClass';
    }

    // Build the file name (e.g., classes/MyClass.php)
    $fileName = $dir . '/' . $sanitizedClassName . '.php';

    // Start building the PHP class code
    $classCode = "<?php\n";
    $classCode .= "class $sanitizedClassName {\n\n";

    // Add properties (each property becomes a public member variable)
    if (!empty($classData['properties'])) {
        foreach ($classData['properties'] as $property) {
            $propertyName = trim($property);
            // Sanitize the property name for valid PHP variable names
            $propertyNameSanitized = preg_replace('/[^A-Za-z0-9_]/', '', $propertyName);
            if (empty($propertyNameSanitized)) {
                continue;
            }
            $classCode .= "    public \$$propertyNameSanitized;\n";
        }
        $classCode .= "\n";
    }

    // Add methods (each method becomes a public function with a TODO comment)
    if (!empty($classData['methods'])) {
        foreach ($classData['methods'] as $method) {
            $methodName = trim($method);
            $methodNameSanitized = preg_replace('/[^A-Za-z0-9_]/', '', $methodName);
            if (empty($methodNameSanitized)) {
                continue;
            }
            $classCode .= "    public function $methodNameSanitized() {\n";
            $classCode .= "        // TODO: implement $methodNameSanitized method\n";
            $classCode .= "    }\n\n";
        }
    }

    $classCode .= "}\n";

    // Write the class code to the file
    file_put_contents($fileName, $classCode);
}

echo "Classes saved successfully.";
?>

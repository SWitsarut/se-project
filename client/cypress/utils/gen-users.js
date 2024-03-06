async function genUsers() {
  const userData = {
    email: 'user@email.com',
    username: 'user',
    displayName: 'Testuser',
    password: 'testtest',
    confirmPassword: 'testtest',
    acceptTermsOfUse: true
  };
  const userRes = await fetch(`localhost:3000/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData)
  })
  const data = await userRes.json();
  console.log(data)

  const adminData = {
    email: 'admin@example.com',
    username: 'admin',
    displayName: 'Admin',
    password: 'adminpass',
    confirmPassword: 'adminpass',
    acceptTermsOfUse: true
  };
  
  const adminRes = await fetch(`localhost:3000/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminData)
  });
  
  const adminResult = await adminRes.json();
  console.log("Admin created:", adminResult);
  
  
  // For generating publisher
  const publisherData = {
    email: 'publisher@example.com',
    username: 'publisher',
    displayName: 'Publisher',
    password: 'publisherpass',
    confirmPassword: 'publisherpass',
    acceptTermsOfUse: true
  };
  
  const publisherRes = await fetch(`localhost:3000/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(publisherData)
  });
  
  const publisherResult = await publisherRes.json();
  console.log("Publisher created:", publisherResult);
}

genUsers()
  .then(() => {
    console.log("User generation completed.");
  })
  .catch((error) => {
    console.error("Error generating users:", error);
  });
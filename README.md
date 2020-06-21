# shopping-cart-backend
Follow the below steps to run the code:
  1. Run 'git clone https://github.com/sumitchatterjee1805/shopping-cart-backend.git' in the folder where you want to copy the code
  2. Run 'cd shopping-cart-backend'
  3. Run 'npm install'
  4. Create a .env file and save the following in it:</br>
   ``` CONNECTION_STRING=mongodb://localhost:27017/shopping-cart```</br>
  5. Run 'npm start'
  
Following are the different APIs:</br>
  1. Create Category:</br>
      curl --location --request POST 'localhost:8080/admin/category' \</br>
      --header 'Content-Type: application/json' \</br>
      --data-raw '{</br>
          "category_code": "cat-4",</br>
          "name": "Student Laptop",</br>
          "parent": ["cat-1"]</br>
      }'</br>
  2. Add Product:</br>
      curl --location --request POST 'localhost:8080/admin/product' \</br>
      --header 'Content-Type: application/json' \</br>
      --data-raw '{</br>
          "product_code": "prod-1",</br>
          "name": "Lenovo Thinkpad 12 GB",</br>
          "price": "45000",</br>
          "categories": ["cat-1", "cat-2"]</br>
      }'</br>
  3. Edit Product:</br>
      curl --location --request PATCH 'localhost:8080/admin/product' \</br>
      --header 'Content-Type: application/json' \</br>
      --data-raw '{</br>
          "product_code": "prod-1",</br>
          "name": "Lenovo Thinkpad 12 GB",</br>
          "price": "45000",</br>
          "categories": ["cat-1", "cat-2"]</br>
      }'</br>
  4. Get Produvt by category:</br>
      curl --location --request GET 'localhost:8080/admin/category/cat-1/product'
  5. Get Categories with child categories
      curl --location --request GET 'localhost:8080/admin/category'

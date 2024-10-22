# datalist




## INSTALLATION
## frontend
npx create-react-app frontend --template typescript
cd frontend
npm install axios react-paginate

## RUN
npm run start


## backend
mkdir backend
cd backend
npm init -y
npm install express multer cors
npm install --save-dev typescript @types/node @types/express @types/multer
npm install --save-dev jest supertest @types/jest @types/supertest
npx tsc --init

## RUN
npm run dev
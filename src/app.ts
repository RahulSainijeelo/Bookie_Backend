import cookieParser from "cookie-parser"
import express, { urlencoded, json } from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes" // Add this line
import bookRoutes from "./routes/book.routes"
import categoryRoutes from './routes/category.routes';
import sellerRoutes from './routes/seller.routes';
import favoriteRoutes from './routes/favorite.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({extended:true}))
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) // Add this line
app.use("/api/books", bookRoutes)
app.use('/api/categories', categoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.listen(5174,()=>{
  console.log(`listening on the router ${5174} \n http://localhost:5174/`)
})
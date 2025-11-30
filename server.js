import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js'
import detallePedidoRoutes from './routes/detallePedidoRoutes.js'
import reclamoRoutes from './routes/reclamoRoutes.js'
import estadoPedidoRoutes from './routes/estadoPedidoRoutes.js'
import repartidorRoutes from './routes/repartidorRoutes.js'
import asignacionPedidoRoutes from './routes/asignacionPedidoRoutes.js'
import zonaDeRepartoRoutes from './routes/zonaDeRepartoRoutes.js'

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.setupMiddlewares();
    this.setupRoutes();
  }

  setupMiddlewares() {
    this.app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:8100', 'https://la-olla-arequipena-app.onrender.com'],
  credentials: true
}));


    this.app.use(express.json());
  }

  // monta el "routerModule" soportando:
  // - objeto con getRouter()
  // - router directo (express.Router)
  // - export default que contiene el router/instancia
  _mountRouter(path, routerModule) {
    if (!routerModule) return;
    const candidate = (typeof routerModule.getRouter === 'function')
      ? routerModule
      : (routerModule.default ?? routerModule);
    if (candidate && typeof candidate.getRouter === 'function') {
      this.app.use(path, candidate.getRouter());
    } else {
      this.app.use(path, candidate);
    }
  }

  setupRoutes() {
    this._mountRouter('/api/auth', authRoutes);
    this._mountRouter('/api/products', productRoutes);
    this._mountRouter('/api/clientes', clienteRoutes);
    this._mountRouter('/api/pagos', pagoRoutes);
    this._mountRouter('/api/pedidos', pedidoRoutes);
    this._mountRouter('/api/detalles', detallePedidoRoutes);
    this._mountRouter('/api/reclamos', reclamoRoutes);
    this._mountRouter('/api/estadospedidos', estadoPedidoRoutes);
    this._mountRouter('/api/repartidores', repartidorRoutes);
    this._mountRouter('/api/asignaciones', asignacionPedidoRoutes);
    this._mountRouter('/api/zonas', zonaDeRepartoRoutes);
  }

  async start() {
    await connectDB();
    this.app.listen(this.port, () => console.log(`✅ Servidor backend en http://localhost:${this.port}`));
  }
}

const server = new App();
server.start();


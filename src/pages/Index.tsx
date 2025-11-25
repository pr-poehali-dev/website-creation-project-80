import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Беспроводные наушники',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/12327bb0-7d6b-4a45-99b0-8033d41f6104.jpg',
    description: 'Premium качество звука'
  },
  {
    id: 2,
    name: 'Умные часы',
    price: 24990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/01eb9d84-c088-4c96-8e2a-ac0c31fe989c.jpg',
    description: 'Стильный дизайн и функциональность'
  },
  {
    id: 3,
    name: 'Рюкзак для ноутбука',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/c06bbb86-05d2-4d1a-9087-dfc30ca922dd.jpg',
    description: 'Современный и практичный'
  },
  {
    id: 4,
    name: 'Портативная колонка',
    price: 6990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/12327bb0-7d6b-4a45-99b0-8033d41f6104.jpg',
    description: 'Мощный звук в компактном корпусе'
  },
  {
    id: 5,
    name: 'Клавиатура механическая',
    price: 15990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/01eb9d84-c088-4c96-8e2a-ac0c31fe989c.jpg',
    description: 'Идеальная для работы и игр'
  },
  {
    id: 6,
    name: 'Мышь беспроводная',
    price: 4990,
    image: 'https://cdn.poehali.dev/projects/11036952-557e-4312-8248-5f9d3c83d56a/files/c06bbb86-05d2-4d1a-9087-dfc30ca922dd.jpg',
    description: 'Эргономичный дизайн'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Добавлено в корзину',
      description: product.name
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары в корзину',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Заказ оформлен!',
      description: 'Мы свяжемся с вами в ближайшее время'
    });
    setCart([]);
    setOrderForm({ name: '', email: '', phone: '', address: '' });
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">SHOP</h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {cart.map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.price.toLocaleString('ru-RU')} ₽
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 ml-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Итого:</span>
                        <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setIsCheckoutOpen(true)}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-5xl font-bold tracking-tight">Каталог товаров</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Минималистичный дизайн и высокое качество
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <Button onClick={() => addToCart(product)}>
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Оформление заказа</SheetTitle>
          </SheetHeader>
          
          <form onSubmit={handleSubmitOrder} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  required
                  value={orderForm.name}
                  onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={orderForm.email}
                  onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                  placeholder="ivan@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={orderForm.phone}
                  onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Адрес доставки</Label>
                <Input
                  id="address"
                  required
                  value={orderForm.address}
                  onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                  placeholder="Москва, ул. Примерная, д. 1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Ваш заказ:</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Подтвердить заказ
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

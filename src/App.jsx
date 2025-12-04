import React, { useState, useEffect } from 'react';
import { Heart, Plus, X, User, Home, Shirt, Menu, ChevronLeft, Upload, Trash2, Shuffle } from 'lucide-react';

export default function WardrobeApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) saveData();
  }, [wardrobeItems, outfits, user]);

  const loadData = async () => {
    try {
      const userData = await window.storage.get('user');
      const itemsData = await window.storage.get('wardrobeItems');
      const outfitsData = await window.storage.get('outfits');
      
      if (userData) setUser(JSON.parse(userData.value));
      if (itemsData) setWardrobeItems(JSON.parse(itemsData.value));
      if (outfitsData) setOutfits(JSON.parse(outfitsData.value));
    } catch (error) {
      console.log('No saved data found');
    }
  };

  const saveData = async () => {
    try {
      await window.storage.set('user', JSON.stringify(user));
      await window.storage.set('wardrobeItems', JSON.stringify(wardrobeItems));
      await window.storage.set('outfits', JSON.stringify(outfits));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const handleLogin = (username) => {
    setUser({ username, joinDate: new Date().toISOString() });
    setCurrentScreen('home');
  };

  const addWardrobeItem = (item) => {
    setWardrobeItems([...wardrobeItems, { ...item, id: Date.now() }]);
  };

  const deleteWardrobeItem = (id) => {
    setWardrobeItems(wardrobeItems.filter(item => item.id !== id));
  };

  const createOutfit = (outfit) => {
    setOutfits([...outfits, { ...outfit, id: Date.now() }]);
  };

  const deleteOutfit = (id) => {
    setOutfits(outfits.filter(outfit => outfit.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onBack={() => setCurrentScreen('welcome')} />;
      case 'home':
        return <HomeScreen user={user} onNavigate={setCurrentScreen} />;
      case 'closet':
        return <ClosetScreen 
          items={wardrobeItems} 
          onAddItem={addWardrobeItem}
          onDeleteItem={deleteWardrobeItem}
          onBack={() => setCurrentScreen('home')} 
        />;
      case 'outfits':
        return <OutfitsScreen 
          wardrobeItems={wardrobeItems}
          outfits={outfits}
          onCreateOutfit={createOutfit}
          onDeleteOutfit={deleteOutfit}
          onBack={() => setCurrentScreen('home')} 
        />;
      case 'profile':
        return <ProfileScreen user={user} onBack={() => setCurrentScreen('home')} />;
      default:
        return <HomeScreen user={user} onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {renderScreen()}
    </div>
  );
}

function WelcomeScreen({ onNext }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 animate-fade-in">
        <Heart className="w-20 h-20 text-pink-500 mx-auto animate-pulse" />
        <h1 className="text-5xl font-bold text-pink-600">My Wardrobe</h1>
        <p className="text-gray-600 text-lg">Organize your style, create amazing outfits</p>
        <button
          onClick={onNext}
          className="mt-8 px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onBack }) {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-6 left-6 text-pink-500">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">Welcome Back</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ user, onNavigate }) {
  const menuItems = [
    { icon: Shirt, label: 'My Closet', screen: 'closet', color: 'bg-pink-400' },
    { icon: Shuffle, label: 'My Outfits', screen: 'outfits', color: 'bg-rose-400' },
    { icon: User, label: 'Profile', screen: 'profile', color: 'bg-pink-500' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Hello, {user?.username}!</h1>
          <p className="text-gray-600">What would you like to do today?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`${item.color} text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}
            >
              <item.icon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold">{item.label}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClosetScreen({ items, onAddItem, onDeleteItem, onBack }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'tops', 'bottoms', 'dresses', 'shoes', 'accessories'];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-pink-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-pink-600">My Closet</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-pink-500 hover:bg-pink-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group relative">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Shirt className="w-16 h-16 text-pink-300" />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.category}</p>
              </div>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Shirt className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-500">No items in this category yet</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={(item) => {
            onAddItem(item);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddItemModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tops');
  const [image, setImage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim(), category, image });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pink-600">Add Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
              placeholder="e.g., Blue Denim Jacket"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
            >
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
            <div className="border-2 border-dashed border-pink-200 rounded-xl p-4 text-center hover:border-pink-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {image ? (
                  <img src={image} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </>
                )}
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all font-medium"
          >
            Add to Closet
          </button>
        </div>
      </div>
    </div>
  );
}

function OutfitsScreen({ wardrobeItems, outfits, onCreateOutfit, onDeleteOutfit, onBack }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-pink-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-pink-600">My Outfits</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map(outfit => (
            <div key={outfit.id} className="bg-white rounded-2xl shadow-lg p-4 group relative">
              <h3 className="font-bold text-lg text-gray-800 mb-3">{outfit.name}</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {outfit.items.map((item, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shirt className="w-8 h-8 text-pink-300" />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onDeleteOutfit(outfit.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {outfits.length === 0 && (
          <div className="text-center py-12">
            <Shuffle className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-500">No outfits created yet</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateOutfitModal
          wardrobeItems={wardrobeItems}
          onClose={() => setShowCreateModal(false)}
          onCreate={(outfit) => {
            onCreateOutfit(outfit);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateOutfitModal({ wardrobeItems, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = () => {
    if (name.trim() && selectedItems.length > 0) {
      onCreate({ name: name.trim(), items: selectedItems });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-2xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pink-600">Create Outfit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outfit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
              placeholder="e.g., Casual Weekend"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Items ({selectedItems.length} selected)
            </label>
            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
              {wardrobeItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedItems.find(i => i.id === item.id)
                      ? 'border-pink-500 ring-2 ring-pink-300'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shirt className="w-8 h-8 text-pink-300" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || selectedItems.length === 0}
            className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Outfit
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ user, onBack }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-pink-500 mb-8">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.username}</h1>
          <p className="text-gray-500 mb-8">Fashion Enthusiast</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-pink-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-800">
                {new Date(user?.joinDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-800">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

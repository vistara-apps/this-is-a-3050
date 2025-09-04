# FlowLink CRM

**Automate Your Business, Connect Your Apps.**

FlowLink CRM is a no-code platform for small businesses to automate CRM workflows, connect disparate business tools, and manage dynamic data using visually designed sequences.

![FlowLink CRM Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=FlowLink+CRM+Dashboard)

## 🚀 Features

### 🔗 Pre-built CRM Connectors
Effortlessly link popular business tools to your CRM:
- **Google Sheets** - Sync data bidirectionally
- **Slack** - Send notifications and updates
- **Zapier** - Connect to 5,000+ apps
- **Microsoft Teams** - Team collaboration
- **Airtable** - Database management

### 🎨 No-Code Workflow Builder
Visually design custom automated sequences:
- Drag-and-drop interface
- Trigger-based automation
- Conditional logic support
- Real-time execution monitoring
- Error handling and retry logic

### 📊 Dynamic Data Fields & Views
Create and manage custom fields that adapt to your business:
- Custom field types (text, number, dropdown, date, etc.)
- Flexible data views with filtering
- Entity-specific customization (contacts, deals, companies)
- Bulk data import/export

### 🔧 API-First Customization
Robust RESTful API for developers:
- Complete CRUD operations
- Webhook support
- Rate limiting and authentication
- SDKs for JavaScript/Node.js and Python
- Comprehensive documentation

## 🏗️ Architecture

FlowLink CRM is built with a modern, scalable architecture:

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context with useReducer
- **API Layer**: RESTful API with comprehensive validation
- **Authentication**: JWT-based with OAuth integrations
- **Workflow Engine**: Custom execution engine with step-by-step processing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### Services & Architecture
- **API Service Layer** - Centralized API communication
- **Authentication Service** - JWT and OAuth handling
- **Validation Service** - Comprehensive data validation
- **Workflow Engine** - Custom automation execution
- **Notification System** - Real-time user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/flowlink-crm.git
   cd flowlink-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_SLACK_CLIENT_ID=your_slack_client_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Creating Your First Workflow

1. **Navigate to Workflows** in the sidebar
2. **Click "Create Workflow"**
3. **Add a Trigger** (e.g., "New CRM Record")
4. **Add an Action** (e.g., "Send Slack Message")
5. **Configure the steps** with your specific settings
6. **Save and Enable** your workflow

### Setting Up Integrations

1. **Go to Integrations** page
2. **Click "Add Integration"**
3. **Select your platform** (Google Sheets, Slack, etc.)
4. **Follow the OAuth flow** to connect
5. **Configure integration settings**

### Managing CRM Data

1. **Visit CRM Records** section
2. **Add custom fields** for your business needs
3. **Import existing data** via CSV or API
4. **Create filtered views** for different use cases

## 🔧 Configuration

### Subscription Plans

FlowLink CRM offers tiered pricing:

- **Free**: 3 workflows, 2 integrations, 100 CRM records
- **Pro ($29/mo)**: 25 workflows, 10 integrations, 5,000 CRM records
- **Business ($79/mo)**: Unlimited everything + priority support

### Custom Fields

Support for various field types:
- Text, Number, Email, Phone
- Date, DateTime, Boolean
- Dropdown, Multi-select
- Textarea for long text

### Workflow Steps

Available step types:
- **Triggers**: CRM events, webhooks, scheduled
- **Actions**: Send messages, update records, API calls
- **Conditions**: If/then logic, data validation
- **Delays**: Time-based pauses

## 🔌 API Integration

### Authentication

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
```

### Creating a Workflow

```javascript
const workflow = await fetch('/api/workflows', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Lead Notification',
    stepsJson: [
      { type: 'trigger', platform: 'CRM', event: 'new_record' },
      { type: 'action', platform: 'Slack', action: 'send_message' }
    ]
  })
});
```

### Managing CRM Records

```javascript
const record = await fetch('/api/crm-records', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp'
    }
  })
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual component and service testing
- **Integration Tests**: API and workflow execution testing
- **E2E Tests**: Full user journey testing

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Build the image
docker build -t flowlink-crm .

# Run the container
docker run -p 3000:3000 flowlink-crm
```

### Environment Variables

Required for production:
- `VITE_API_BASE_URL` - Your API server URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_SLACK_CLIENT_ID` - Slack OAuth client ID

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[User Guide](docs/USER_GUIDE.md)** - Step-by-step usage instructions
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical implementation details
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features:

- **Bug Report**: Use the bug report template
- **Feature Request**: Use the feature request template
- **Security Issues**: Email security@flowlinkcrm.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Vite** - For the fast build tool
- **All Contributors** - Thank you for your contributions!

## 📞 Support

- **Documentation**: https://docs.flowlinkcrm.com
- **Community Forum**: https://community.flowlinkcrm.com
- **Email Support**: support@flowlinkcrm.com
- **Status Page**: https://status.flowlinkcrm.com

## 🗺️ Roadmap

### Q1 2024
- [ ] Advanced workflow conditions
- [ ] Bulk operations for CRM records
- [ ] Enhanced analytics dashboard
- [ ] Mobile app (React Native)

### Q2 2024
- [ ] AI-powered workflow suggestions
- [ ] Advanced reporting features
- [ ] Third-party marketplace
- [ ] Enterprise SSO support

### Q3 2024
- [ ] Multi-tenant architecture
- [ ] Advanced security features
- [ ] Performance optimizations
- [ ] International localization

---

**Made with ❤️ by the FlowLink CRM Team**

[Website](https://flowlinkcrm.com) • [Documentation](https://docs.flowlinkcrm.com) • [Community](https://community.flowlinkcrm.com) • [Twitter](https://twitter.com/flowlinkcrm)

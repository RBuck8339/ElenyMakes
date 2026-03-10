import { 
  Html, Body, Container, Text, Tailwind, Section, Row, Column, Head, Font 
} from '@react-email/components';

export const ReceiptEmailTemplate = ({ items, orderId, num_emails }) => (
  <Html>
    <Head>
      <Font
        fontFamily="Playfair Display"
        fallbackFontFamily="serif"
        webFont={{
          url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD7K3dQ3-3u7-60K5F79K2ETf.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Lora"
        fallbackFontFamily="serif"
        webFont={{
          url: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuMw9SmtV9P068KcMq.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              'background': '#F5EDEC',
              'text-espresso': '#3D3534',
              'accent-green': '#619B8A',
              'main-brown': '#533638',
            },
            fontFamily: {
              'primary': ['"Playfair Display"', 'serif'],
              'secondary': ['Lora', 'serif'],
            },
          },
        },
      }}
    >
      <Body className="bg-background font-primary">
        <Container className="mx-auto my-10 p-5 w-[580px] bg-white border border-slate-200 rounded-lg">
          <Section className="mb-8">
            <Text className="text-2xl font-primary text-text-espresso m-0">Eleny Makes</Text>
            <Text className="font-secondary text-text-espresso opacity-70">Order #{orderId}</Text>
          </Section>

          <Text className="font-secondary text-text-espresso mb-4 leading-relaxed">
            Thank you for supporting Eleny Makes! Your order has been processed and your 
            digital patterns are on their way to your inbox. Be on the lookout for an email 
            from <code className="bg-slate-50 px-1">patterns@elenymakes.com</code>. 
            Based on the size of your order, you should receive <strong>{num_emails}</strong> emails 
            from this address.
          </Text>

          <Section className="border-t border-b border-accent-green py-4 my-6">
            {/* Could add images here */}
            {items.map((item, index) => (
              <Row key={index} className="py-2">
                <Column className="font-secondary text-text-espresso">{item.name}</Column>
                <Column align="right" className="font-medium font-secondary text-text-espresso">
                  ${Number(item.price).toFixed(2)}
                </Column>
              </Row>
            ))}
          </Section>

          <Text className="font-secondary text-text-espresso text-sm">
            If you have any questions or need assistance in receiving your order, 
            please don't hesitate to reach out to us at{' '}
            <a href="mailto:support@elenymakes.com" className="text-accent-green underline">
              support@elenymakes.com
            </a>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
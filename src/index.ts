import { FlatfileListener } from '@flatfile/listener';
import { configureSpace } from '@flatfile/plugin-space-configure';

export default function (listener: FlatfileListener) {
  // Configure your space and listeners here
  console.log('Flatfile listener initialized');
  
  // Basic space configuration
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: 'QGenda Data',
          sheets: [
            {
              name: 'Demographics',
              slug: 'demographics',
              fields: [
                {
                  key: 'firstName',
                  type: 'string',
                  label: 'First Name'
                },
                {
                  key: 'lastName',
                  type: 'string',
                  label: 'Last Name'
                },
                {
                  key: 'email',
                  type: 'string',
                  label: 'Email'
                }
              ]
            }
          ]
        }
      ]
    })
  );
}
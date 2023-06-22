import { Button } from 'antd-mobile';
// import styles from './index.less'

export default function IndexPage() {
  return (
    <div>
      <Button color='primary' fill='solid'>
        Solid
      </Button>
      <Button color='primary' fill='outline'>
        Outline
      </Button>
      <Button color='primary' fill='none'>
        None
      </Button>
      <Button block color='primary' size='large'>
        Block Button
      </Button>
      <Button color='primary'>Primary</Button>
      <Button color='success'>Success</Button>
      <Button color='danger'>Danger</Button>
      <Button color='warning'>Warning</Button>
    </div>
  );
}

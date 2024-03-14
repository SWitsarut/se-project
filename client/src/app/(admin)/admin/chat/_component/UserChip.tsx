import { UserMsg } from '@/types/chat'
import { Avatar, Center, HoverCard, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCopyCheck } from '@tabler/icons-react'

export default function UserChip({
  user,
  onClick,
  selected,
}: {
  user: UserMsg
  onClick?: () => void
  selected?: boolean
}) {
  return (
    <HoverCard width={200} position="right" openDelay={50} shadow="md">
      <HoverCard.Target>
        <div
          className={`${selected ? 'bg-blue-200' : null} md:w-52 hover:cursor-pointer p-2 border border-gray-300`}
          onClick={onClick}
        >
          <div className="flex md:flex-row flex-col md:gap-3 items-center justify-center">
            <Avatar src={user.avatar} alt={user.username} />
            <div className="flex flex-col md:block w-full">
              <div className="flex">
                {/* <Text classNames={{ root: 'hidden md:block font-bold' }}>
              name:
            </Text> */}
                <Text
                  classNames={{ root: 'md:w-full md:font-normal font-bold' }}
                >
                  {user.displayName.length > 7
                    ? user.displayName.substring(0, 7) + '...'
                    : user.displayName}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Center classNames={{ root: 'flex flex-col' }}>
          <Avatar src={user.avatar} alt={user.username} />
          <div className="flex flex-col">
            <UserInfoChip name="id" value={user.id} />
            <UserInfoChip name="username" value={user.username} />
            <UserInfoChip name="displayname" value={user.displayName} />
            <UserInfoChip name="role" value={user.role} />
          </div>
        </Center>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

function UserInfoChip({ name, value }: { name: string; value: string }) {
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(value)
        notifications.show({
          title: `${name} copied!`,
          message: value,
          icon: <IconCopyCheck />,
          withBorder: true,
          color: 'green',
        })
      }}
      className="hover:cursor-copy hover:text-blue-700 flex flex-wrap"
    >
      <Text>{name} :</Text>
      <Text>{value.length > 10 ? value.substring(0, 10) + '...' : value}</Text>
    </div>
  )
}

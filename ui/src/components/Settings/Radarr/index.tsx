import { SaveIcon } from '@heroicons/react/solid'
import { useContext, useEffect, useRef, useState } from 'react'
import SettingsContext from '../../../contexts/settings-context'
import { PostApiHandler } from '../../../helpers/ApiHandler'
import Alert from '../../Common/Alert'
import Button from '../../Common/Button'

const RadarrSettings = () => {
  const settingsCtx = useContext(SettingsContext)
  const hostnameRef = useRef<HTMLInputElement>(null)
  const portRef = useRef<HTMLInputElement>(null)
  const apiKeyRef = useRef<HTMLInputElement>(null)
  const [hostname, setHostname] = useState<string>()
  const [port, setPort] = useState<string>()
  const [error, setError] = useState<boolean>()
  const [changed, setChanged] = useState<boolean>()

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      hostnameRef.current?.value &&
      portRef.current?.value &&
      apiKeyRef.current?.value
    ) {
      const hostnameVal = hostnameRef.current.value.includes('http')
        ? hostnameRef.current.value
        : hostnameRef.current.value.includes('https')
        ? hostnameRef.current.value
        : 'http://' + hostnameRef.current.value
      const payload = {
        radarr_url: `${hostnameVal}:${portRef.current.value}`,
        radarr_api_key: apiKeyRef.current.value,
      }
      console.log(payload)
      const resp: { code: 0 | 1; message: string } = await PostApiHandler(
        '/settings',
        {
          ...settingsCtx.settings,
          ...payload,
        }
      )
      if (Boolean(resp.code)) {
        settingsCtx.addSettings({
          ...settingsCtx.settings,
          ...payload,
        })
        setError(false)
        setChanged(true)
      } else setError(true)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    const url = settingsCtx.settings.radarr_url?.split(':')
    if (url) setHostname(`${url[0]}:${url[1]}`)
  }, [settingsCtx])

  useEffect(() => {
    const url = settingsCtx.settings.radarr_url
      ?.split('')
      .reverse()
      .join('')
      .split(':')[0]
      .split('')
      .reverse()
      .join('')
    if (url) setPort(`${url}`)
  }, [settingsCtx])

  return (
    <div className="h-full w-full">
      <div className="section h-full w-full">
        <h3 className="heading">Radarr Settings</h3>
        <p className="description">Radarr configuration</p>
      </div>

      {error ? (
        <Alert type="warning" title="Not all fields contain values" />
      ) : changed ? (
        <Alert type="info" title="Settings succesfully updated" />
      ) : undefined}

      <div className="section">
        <form onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="hostname" className="text-label">
              Hostname or IP
            </label>
            <div className="form-input">
              <div className="form-input-field">
                <input
                  name="hostname"
                  id="hostname"
                  type="text"
                  ref={hostnameRef}
                  defaultValue={hostname}
                ></input>
              </div>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="port" className="text-label">
              Port
            </label>
            <div className="form-input">
              <div className="form-input-field">
                <input
                  name="port"
                  id="port"
                  type="number"
                  ref={portRef}
                  defaultValue={port}
                ></input>
              </div>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="apikey" className="text-label">
              Api key
            </label>
            <div className="form-input">
              <div className="form-input-field">
                <input
                  name="apikey"
                  id="apikey"
                  type="text"
                  ref={apiKeyRef}
                  defaultValue={settingsCtx.settings.radarr_api_key}
                ></input>
              </div>
            </div>
          </div>

          <div className="actions mt-5 w-full">
            <div className="flex justify-end">
              <span className="ml-3 inline-flex rounded-md shadow-sm">
                <Button
                  buttonType="primary"
                  type="submit"
                  // disabled={isSubmitting || !isValid}
                >
                  <SaveIcon />
                  <span>Save Changes</span>
                </Button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RadarrSettings